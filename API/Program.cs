using System.Text;
using API.Data;
using API.Endpoints;
using API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args); 

var jwtSetting = builder.Configuration.GetSection("JwtSettings");  //creating a variable for the jwt settings defined in appsettingjson to use below.

builder.Services.AddDbContext<AppDbContext>(X => X.UseSqlite("Data Source=chat.db")); //injecting applicationdbcontext

builder.Services.AddIdentityCore<AppUser>()
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

//configuring the authentication 
builder.Services.AddAuthentication(opt => 
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(option =>
{
    option.SaveToken = true;
    option.RequireHttpsMetadata = false;
    option.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes
        (jwtSetting.GetSection("SecurityKey").Value!)), // using the jwt variable here
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

builder.Services.AddAuthorization();
// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication(); //using the above authentication here
app.UseAuthorization();

app.MapAccountEndpoint();

app.Run();