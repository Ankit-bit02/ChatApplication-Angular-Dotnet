using API.Common;
using API.DTOs;
using API.Extensions;
using API.Models;
using API.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Endpoints;

public static class AccountEndpoint
{
    public static RouteGroupBuilder MapAccountEndpoint(this WebApplication app)
    {
        var group = app.MapGroup("/api/account").WithTags("account");

        // POST api for User Registration
        group.MapPost("/register", async (HttpContext context, UserManager<AppUser> userManager, [FromForm] string fullName, [FromForm] string email, [FromForm] string password, [FromForm] string userName, [FromForm] IFormFile? profileImage) =>
        {
            var userFromDb = await userManager.FindByEmailAsync(email);

            if (userFromDb is not null)
            {
                return Results.BadRequest(Response<string>.Failure("User already exists."));
            }

            if (profileImage == null)
            {
                return Results.BadRequest(Response<string>.Failure("Profile image is required."));
            }

            var picture = await FileUpload.Upload(profileImage);

            picture = $"{context.Request.Scheme}://{context.Request.Host}/uploads/{picture}";

            var user = new AppUser
            {
                Email = email,
                FullName = fullName,
                UserName = userName,
                ProfileIMage = picture
            };

            var result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return Results.BadRequest(Response<string>.Failure(result.Errors.Select(x => x.Description).FirstOrDefault()!));
            }
            return Results.Ok(Response<string>.Success("", "User created successfully."));

        }).DisableAntiforgery();

        // POST api for User Login
        group.MapPost("/login", async (UserManager<AppUser> UserManager, TokenService tokenService, [FromForm] LoginDto dto) =>
        {                               
            if (dto == null)
            {
                return Results.BadRequest(Response<string>.Failure("Invalid login credentails."));
            }

            var user = await UserManager.FindByEmailAsync(dto.Email);

            if (user == null)
            {
                return Results.BadRequest(Response<string>.Failure("User not found."));
            }

            var result = await UserManager.CheckPasswordAsync(user!, dto.Password);

            if (!result)
            {
                return Results.BadRequest(Response<string>.Failure("Invalid Password"));
            }

            var token = tokenService.GenerateToken(user.Id, user.UserName!);

            return Results.Ok(Response<string>.Success(token, "User logged in successfully"));   
        }).DisableAntiforgery();

        // GET api for getting User Details
        group.MapGet("/me", async (HttpContext context, UserManager<AppUser> userManager) =>
        {
            var currentLoggedInUserId = context.User.GetUserId()!;
            var currentLoggedInUser = await userManager.Users.FirstOrDefaultAsync(x => x.Id == currentLoggedInUserId.ToString());
            return Results.Ok(Response<AppUser>.Success(currentLoggedInUser!, "User details fetched successfully."));
        }).RequireAuthorization();

        return group;
    }
}
