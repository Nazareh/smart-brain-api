create table login (
id serial primary key,
hash varchar(100),
email text unique not null
)