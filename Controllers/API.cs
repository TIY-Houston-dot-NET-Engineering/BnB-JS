using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[Route("/api/bnb")]
public class BnBController : CRUDController<BnB> {
    public BnBController(IRepository<BnB> r) : base(r){}
}

[Authorize]
[Route("/api/message")]
public class MessageController : CRUDController<Message> {
    public MessageController(IRepository<Message> r) : base(r){}
}

[Authorize]
[Route("/api/visitor")]
public class VisitorController : CRUDController<Visitor> {
    public VisitorController(IRepository<Visitor> r) : base(r){}
}
