-- +goose Up
create table users
(
    id         bigint unsigned auto_increment primary key,
    first_name varchar(255) not null,
    last_name  varchar(255) not null,
    avatar     text,
    created    int          not null,
    updated    int          not null
);

create table messages
(
    id           bigint unsigned auto_increment primary key,
    user_id      bigint  not null references users (id),
    staff_id     bigint  null references staff (id),
    status       tinyint not null comment '1=unassigned, 2=assigned, 3=resolved',
    unread       bool    not null,
    content_type tinyint not null comment '1=text, 2=image, 3=rich',
    content      text    not null,
    sent_at      bigint  not null comment 'created in unix millis',
    from_user    bool    not null,
    created      int     not null,
    updated      int     not null,
    deleted      int     null
);

-- TODO indexes
create table staff
(
    id         bigint unsigned auto_increment primary key,
    first_name varchar(255) not null,
    last_name  varchar(255) not null,
    avatar     text         not null,
    created    int          not null,
    updated    int          not null
);

-- +goose Down
drop table users, messages, staff;
