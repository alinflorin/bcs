
using Bcs.Api.OpenApi;
using Bcs.Api.Services;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using SharpGrip.FluentValidation.AutoValidation.Mvc.Extensions;
using System.Security.Claims;
using System.Text.Json;

namespace Bcs.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        var appConfig = new AppConfig();
        builder.Configuration.Bind(appConfig);
        builder.Services.AddSingleton(appConfig);

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.Authority = appConfig.Oidc!.Authority;
            options.Audience = appConfig.Oidc!.Audience;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = appConfig.Oidc!.Authority,

                ValidateAudience = true,
                ValidAudience = appConfig.Oidc!.Audience,

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

        builder.Services.AddControllers().AddJsonOptions(j =>
        {
            j.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            j.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
            j.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
            j.JsonSerializerOptions.UnmappedMemberHandling = System.Text.Json.Serialization.JsonUnmappedMemberHandling.Skip;
            j.JsonSerializerOptions.ReadCommentHandling = JsonCommentHandling.Skip;
        });
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
        });


        builder.Services.AddSingleton<IDatabaseService, MongoDbDatabaseService>();
        builder.Services.AddSingleton<IVectorStoreService, QdrantVectorStoreService>();

        builder.Services.AddSingleton<IHealthService, HealthService>();
        builder.Services.AddSingleton<IAdminService, AdminService>();

        builder.Services.AddValidatorsFromAssemblyContaining<Program>();
        builder.Services.AddFluentValidationAutoValidation();

        builder.Services.AddAutoMapper(cfg => {}, typeof(Program).Assembly);

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi("/api/openapi/v1.json").CacheOutput();

            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/api/openapi/v1.json", "v1");
                options.RoutePrefix = "api/swagger";
                options.OAuthClientId(appConfig.Oidc!.ClientId);
                options.OAuthAdditionalQueryStringParams(new Dictionary<string, string>
                {
                    { "audience", appConfig.Oidc!.Audience }
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
