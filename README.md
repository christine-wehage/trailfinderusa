# trailfinderusa

ROUTES

NAME        URL                                 VERB        DESC
==================================================
index       /trails                             GET         displays list of all trails
new         /trails/new                         GET         displays form to add new trail
create      /trails                             POST        adds new trail to db
show        /trails/:id                         GET         shows info about single trail

new         /trails/:id/comments/new            GET
create      /trails/:id/comments                POST
