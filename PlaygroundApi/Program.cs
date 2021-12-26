using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var db = builder.Configuration.GetConnectionString("Default");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TextDb>(options => options.UseNpgsql(db));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/", (TextDb db) => db.Get());
app.MapGet("/hello", () => "Hello!");
app.MapPost("/", (Text text, TextDb db) => db.Save(text));

using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetService<TextDb>()!;
    ctx.Database.Migrate();
    
    if (!ctx.Texts!.Any())
        ctx.Init();
}

app.Run();

record Text(int Id, string Value);

class TextDb : DbContext
{
    public TextDb(DbContextOptions options) : base(options) { }
    public DbSet<Text>? Texts { get; set; }

    public void Init()
    {
        Texts?.Add(new Text(1, string.Empty));
        SaveChanges();
    }

    public string Get() =>
        Texts!.First().Value;

    public void Save(Text text)
    {
        Texts?.Update(text with { Id = 1 });
        SaveChanges();
    }
}