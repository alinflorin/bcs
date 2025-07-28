
using Bcs.Api.OpenApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
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
            var policy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
                .RequireAuthenticatedUser()
                .RequireAssertion(context =>
                {
                    var scopeClaim = context.User.FindFirst("scope")?.Value;
                    return scopeClaim?.Split(' ').Contains("api:all") == true;
                })
                .Build();
            options.AddPolicy("RequireApiScope", policy);
            options.DefaultPolicy = policy;
        });

        builder.Services.AddControllers();
        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi(options =>
        {
            options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
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


        app.MapControllers().RequireAuthorization("RequireApiScope");

        app.Run();
    }
}
