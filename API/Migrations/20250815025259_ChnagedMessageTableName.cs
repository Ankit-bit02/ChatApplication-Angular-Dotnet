using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ChnagedMessageTableName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messgaes_AspNetUsers_ReceiverId",
                table: "Messgaes");

            migrationBuilder.DropForeignKey(
                name: "FK_Messgaes_AspNetUsers_SenderId",
                table: "Messgaes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messgaes",
                table: "Messgaes");

            migrationBuilder.RenameTable(
                name: "Messgaes",
                newName: "Messages");

            migrationBuilder.RenameIndex(
                name: "IX_Messgaes_SenderId",
                table: "Messages",
                newName: "IX_Messages_SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_Messgaes_ReceiverId",
                table: "Messages",
                newName: "IX_Messages_ReceiverId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messages",
                table: "Messages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AspNetUsers_ReceiverId",
                table: "Messages",
                column: "ReceiverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AspNetUsers_SenderId",
                table: "Messages",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AspNetUsers_ReceiverId",
                table: "Messages");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AspNetUsers_SenderId",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messages",
                table: "Messages");

            migrationBuilder.RenameTable(
                name: "Messages",
                newName: "Messgaes");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_SenderId",
                table: "Messgaes",
                newName: "IX_Messgaes_SenderId");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_ReceiverId",
                table: "Messgaes",
                newName: "IX_Messgaes_ReceiverId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messgaes",
                table: "Messgaes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messgaes_AspNetUsers_ReceiverId",
                table: "Messgaes",
                column: "ReceiverId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Messgaes_AspNetUsers_SenderId",
                table: "Messgaes",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
