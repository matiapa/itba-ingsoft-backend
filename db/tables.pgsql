
create table users
(
    id        text primary key,
    rol       text not null,
    name      text not null,
    last_name text not null,
    email     text not null unique

);


create table personal_info(
    user_id text references users(id) on delete cascade,
    document_type text not null,
    document text unique,
    telephone_type text not null,
    telephone text not null,
    country text not null,
    province text not null,
    location text not null,
    zip text not null,
    street text not null,
    street_number text not null,
    primary key(user_id)

);

create table experts(
    id serial primary key,
    name text,
    last_name text,
    category  text

);


create table auction(
    id serial primary key,
    category text,
    name text

);


create table expert_asign(
    id_exp integer not null references experts(id) on delete cascade,
    id_ac integer not null references auction(id) on delete cascade,
 
    primary key(id_exp,id_ac)
);

create table lot(
    id serial primary key,
    name text,
    descripcion text,
    state text,
    auction_id integer not null references auction(id) on delete cascade
);

create table lotPhotos(
    lot_id integer not null references lots(id),
    url text unique,
    primary key(lot_id,url)
);

create table auction_room(
    owner_id text not null references users(id) on delete set null,
    lot_id integer not null references lots(id) on delete set null,
    highest_bid decimal references bid(id) on delete set null,
    creation_date timestamp,
    duration interval,
);

create table bid(
    user_id text not null references users(id) on delete cascade,
    ar_id integer  not null references auction_room(id) on delete cascade,
    amount decimal not null,
    time timestamp  not null,
    primary key (user_id,ar_id,time)


);