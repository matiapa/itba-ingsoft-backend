create table users
(
    id serial not null
        constraint users_pkey
            primary key,
    rol text not null,
    name text not null,
    last_name text not null,
    email text not null
        constraint users_email_key
            unique
);

alter table users owner to postgres;

create table personal_info
(
    id serial not null
        constraint personal_info_id_fkey
            references users
                on delete cascade,
    document_type text,
    document text,
    telephone_type text,
    telephone text,
    country text,
    province text,
    location text,
    street text,
    street_number text
);

alter table personal_info owner to postgres;