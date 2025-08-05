using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi.Models;

namespace Bcs.Api.OpenApi
{
    internal sealed class BearerSecuritySchemeTransformer(IAuthenticationSchemeProvider authenticationSchemeProvider, IConfiguration config) : IOpenApiDocumentTransformer
    {
        public async Task TransformAsync(OpenApiDocument document, OpenApiDocumentTransformerContext context, CancellationToken cancellationToken)
        {
            var authenticationSchemes = await authenticationSchemeProvider.GetAllSchemesAsync();
            if (authenticationSchemes.Any(authScheme => authScheme.Name == "Bearer"))
            {
                var requirements = new Dictionary<string, OpenApiSecurityScheme>
                {
                    ["Bearer"] = new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.OAuth2,
                        BearerFormat = "Bearer",
                        OpenIdConnectUrl = new Uri(config["Oidc:Authority"]),
                        In = ParameterLocation.Header,
                        Scheme = "Bearer",
                        Name = "Authorization",
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Flows = new OpenApiOAuthFlows
                        {
                            AuthorizationCode = new OpenApiOAuthFlow
                            {
                                Scopes = new Dictionary<string, string>
                                {
                                    ["openid"] = "OpenID Connect scope",
                                    ["profile"] = "Profile scope",
                                    ["email"] = "Email scope",
                                    ["offline_access"] = "RT",
                                    ["api:admin"] = "API admin scope"
                                },
                                RefreshUrl = new Uri(config["Oidc:Authority"] + "/oauth/token"),
                                TokenUrl = new Uri(config["Oidc:Authority"] + "/oauth/token"),
                                AuthorizationUrl = new Uri(config["Oidc:Authority"] + "/authorize"),
                            },
                        }
                    }
                };
                document.Components ??= new OpenApiComponents();
                document.Components.SecuritySchemes = requirements;
                document.SecurityRequirements ??= new List<OpenApiSecurityRequirement>();
                document.SecurityRequirements.Add(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new[] { "openid", "profile", "email", "offline_access", "api:admin" }
                    }
                });
            }
        }
    }
}
