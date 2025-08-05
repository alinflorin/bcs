
using Bcs.Api.OpenApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using Qdrant.Client;
using System.Security.Claims;

namespace Bcs.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = builder.Configuration["Oidc:Authority"];
            options.Audience = builder.Configuration["Oidc:Audience"];
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = builder.Configuration["Oidc:Authority"],

                ValidateAudience = true,
                ValidAudience = builder.Configuration["Oidc:Audience"],

                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(1),

                ValidateIssuerSigningKey = true,
                RequireSignedTokens = true,
                NameClaimType = ClaimTypes.NameIdentifier
            };
        });

        builder.Services.AddAuthorization(options =>
        {
            var requireAuthPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .Build();
            var requireAdminPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .RequireAssertion(context =>
                {
                    var permissions = context.User.FindAll("permissions");
                    return permissions.Any(p => p.Value == "api:admin");
                })
                .Build();
            options.AddPolicy("RequireAuth", requireAuthPolicy);
            options.AddPolicy("RequireAdmin", requireAdminPolicy);
            options.DefaultPolicy = requireAuthPolicy;
        });

        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
        });

        builder.Services.AddSingleton(_ => new QdrantClient(builder.Configuration["Qdrant:Hostname"], builder.Configuration.GetValue<int>("Qdrant:Port"), false, builder.Configuration["Qdrant:ApiKey"], TimeSpan.FromSeconds(30)));

        builder.Services.AddSingleton(_ =>
        {
            var settings = new MongoClientSettings
            {
                Server = new MongoServerAddress(builder.Configuration["MongoDb:Hostname"], builder.Configuration.GetValue<int>("MongoDb:Port")),
            };
            if (builder.Configuration["MongoDb:Username"].Length > 0)
            {
                settings.Credential = MongoCredential.CreateCredential(builder.Configuration["MongoDb:Database"], builder.Configuration["MongoDb:Username"], builder.Configuration["MongoDb:Password"]);
            }
            var client = new MongoClient(settings);
            return client.GetDatabase(builder.Configuration["MongoDb:Database"]);
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi("/api/openapi/v1.json").CacheOutput();

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/api/openapi/v1.json", "v1");
                options.RoutePrefix = "api/swagger";
                options.OAuthClientId(app.Configuration["Oidc:ClientId"]);
                options.OAuthAdditionalQueryStringParams(new Dictionary<string, string>
                {
                    { "audience", app.Configuration["Oidc:Audience"] }
                });
                options.OAuthUsePkce();
                options.OAuthAppName("BCS API");
            });
        }

        app.UseAuthentication();
        app.UseAuthorization();


        app.MapControllers().RequireAuthorization("RequireAuth");

        app.Run();
    }
}
