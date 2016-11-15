using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

public static class Seed
{
    public static void Initialize(DB db, bool canCreate, bool mustMigrate)
    {
        if(canCreate) {
            db.Database.EnsureDeleted();
            db.Database.EnsureCreated();
        }

        if(mustMigrate) db.Database.Migrate();

        if(db.BnBs.Any()) return;
        var m = new Message { Text = "Hi", Visitor = new Visitor { Name = "Matt" } };
        var b = new BnB { Name = "TIY Houston" };
        b.Messages.Add(m);
        db.BnBs.Add(b);
        db.SaveChanges();
    }
}