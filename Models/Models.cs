using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

public class BnB : HasId
{
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
    [Required]
    public List<Message> Messages {get;set;} = new List<Message>();
}

public class Message : HasId {
    [Required]
    public int Id { get; set; }
    [Required]
    public string Text { get; set; } = "";
    
    public int VisitorId {get;set;} // foreign key
    public Visitor Visitor {get;set;}
    
    public int BnBId {get;set;} // foreign key
    // [JsonIgnore]
    public BnB BnB {get;set;}
}

public class Visitor : HasId {
    [Required]
    public int Id { get; set; }
    [Required]
    public string Name { get; set; }
}

// public class IdentityDbContext<TUser> : DbContext {
    // DbSet<IdentityUser> AspNetUsers 
    // DbSet<IdentityRole> AspNetRoles
    // ...
// }
// declare the DbSet<T>'s of our DB context, thus creating the tables
public partial class DB : IdentityDbContext<IdentityUser> {
    public DbSet<BnB> BnBs { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Visitor> Visitors { get; set; }
}

// create a Repo<T> services
public partial class Handler {
    public void RegisterRepos(IServiceCollection services){
        Repo<BnB>.Register(services, "BnBs", 
            dbset => 
                dbset
                .Include(x => x.Messages)
                .ThenInclude(x => x.Visitor));

        Repo<Message>.Register(services, "Messages",
            dbset => 
                dbset.Include(x => x.Visitor));
                
        Repo<Visitor>.Register(services, "Visitors");
    }
}