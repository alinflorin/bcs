FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
ARG VERSION
WORKDIR /app
COPY ./Bcs.Api.sln ./Bcs.Api.sln
COPY ./Bcs.Api.csproj ./Bcs.Api.csproj
RUN dotnet restore
COPY . .
RUN echo "namespace Bcs.Api; public class Version { public const string Value = \"$VERSION\";}" > ./Version.cs
RUN dotnet publish --no-restore -c Release

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=builder /app/bin/Release/net9.0/publish /app
CMD ["dotnet", "./Bcs.Api.dll"]
EXPOSE 80