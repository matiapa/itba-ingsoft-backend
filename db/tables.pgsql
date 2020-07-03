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

create table expert(
    id serial primary key,
    name text,
    last_name text,
    category  text

);
create table lot(
    id serial primary key,
    owner_id text not null references users(id) on delete cascade,
    name text not null,
    description text not null,
    state text not null,
    category text not null,
    initial_price decimal not null,
    quantity integer not null

);


create table following(
    follower_id text references users(id) not null,
    followed_id text references users(id) not null,
    primary key (follower_id,
                followed_id)
);

create table auction(

    lot_id integer not null references lot(id) on delete cascade,

    creation_date timestamp,
    deadline timestamp,
    primary key(lot_id)
);


create table auction_favorites(
    user_id text references users(id) not null,
    auc_id integer references auction(lot_id) not null,
    primary key (user_id,auc_id)
);

create table user_rating(
    id serial primary key ,
    to_id text references users(id) not null,
    from_id text references users(id) not null,
    comment text not null,
    rating decimal not null check(rating between 0 and 5)
);




create table expert_asign(
    id_exp integer not null references expert(id) on delete cascade,
    id_ac integer not null references auction(lot_id) on delete cascade,

    primary key(id_exp,id_ac)
);



create table lotPhotos(
    lot_id integer not null references lot(id),
    url text unique,
    primary key(lot_id,url)
);


create table bid
(
    id serial unique,
    user_id text      not null references users (id) on delete cascade,
    auc_id   integer   not null references auction (lot_id) on delete cascade,
    amount  decimal   not null,
    time    timestamp not null,
    primary key (id,user_id, auc_id, time)
);