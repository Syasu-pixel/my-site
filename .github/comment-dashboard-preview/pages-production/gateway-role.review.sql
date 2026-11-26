-- Production candidate only: adds no login, no credential, no article rows.
-- Run in the approved comment schema migration transaction, before article-write.
-- An unexpected existing role is an error; never silently repurpose a role.
CREATE ROLE dc_comment_gateway NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
CREATE ROLE dc_comment_production_gateway NOLOGIN INHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS;
GRANT dc_comment_gateway TO dc_comment_production_gateway;
