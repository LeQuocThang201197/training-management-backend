--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: training_management; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA training_management;


--
-- Name: AbsenceType; Type: TYPE; Schema: training_management; Owner: -
--

CREATE TYPE training_management."AbsenceType" AS ENUM (
    'INACTIVE',
    'LEAVE'
);


--
-- Name: ManagementRoom; Type: TYPE; Schema: training_management; Owner: -
--

CREATE TYPE training_management."ManagementRoom" AS ENUM (
    'ROOM_1',
    'ROOM_2',
    'ROOM_3'
);


--
-- Name: OrganizationType; Type: TYPE; Schema: training_management; Owner: -
--

CREATE TYPE training_management."OrganizationType" AS ENUM (
    'PROVINCE',
    'OTHER'
);


--
-- Name: PersonRoleType; Type: TYPE; Schema: training_management; Owner: -
--

CREATE TYPE training_management."PersonRoleType" AS ENUM (
    'ATHLETE',
    'COACH',
    'OTHER',
    'SPECIALIST'
);


--
-- Name: TeamGender; Type: TYPE; Schema: training_management; Owner: -
--

CREATE TYPE training_management."TeamGender" AS ENUM (
    'MALE',
    'FEMALE',
    'MIXED'
);


--
-- Name: TeamType; Type: TYPE; Schema: training_management; Owner: -
--

CREATE TYPE training_management."TeamType" AS ENUM (
    'JUNIOR',
    'ADULT',
    'DISABILITY'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Name: AbsenceRecord; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."AbsenceRecord" (
    id integer NOT NULL,
    participation_id integer NOT NULL,
    type training_management."AbsenceType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    note text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    created_by uuid NOT NULL REFERENCES auth.users(id)
);


--
-- Name: AbsenceRecord_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."AbsenceRecord_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Competition; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Competition" (
    id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    note text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isForeign" boolean NOT NULL,
    is_confirmed boolean DEFAULT false NOT NULL,
    concentration_id integer NOT NULL
);


--
-- Name: CompetitionParticipant; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."CompetitionParticipant" (
    participation_id integer NOT NULL,
    competition_id integer NOT NULL,
    note text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL
);


--
-- Name: Competition_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Competition_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Concentration; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Concentration" (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    location text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    note text NOT NULL,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    related_year integer NOT NULL,
    sequence_number integer NOT NULL
);


--
-- Name: Concentration_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Concentration_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Organization; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Organization" (
    id integer NOT NULL,
    name text NOT NULL,
    type training_management."OrganizationType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Organization_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Organization_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Paper; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Paper" (
    id integer NOT NULL,
    number integer,
    code text,
    publisher text NOT NULL,
    type text NOT NULL,
    content text NOT NULL,
    related_year integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    file_name text,
    file_path text,
    created_by uuid NOT NULL REFERENCES auth.users(id)
);


--
-- Name: PaperOnConcentration; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."PaperOnConcentration" (
    paper_id integer NOT NULL,
    concentration_id integer NOT NULL,
    "assignedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    assigned_by uuid NOT NULL REFERENCES auth.users(id)
);


--
-- Name: Paper_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Paper_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Person; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Person" (
    id integer NOT NULL,
    name text NOT NULL,
    identity_number text,
    identity_date timestamp(3) without time zone,
    identity_place text,
    social_insurance text,
    birthday timestamp(3) without time zone,
    phone text,
    email text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    gender boolean NOT NULL
);


--
-- Name: PersonOnConcentration; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."PersonOnConcentration" (
    id integer NOT NULL,
    person_id integer NOT NULL,
    concentration_id integer NOT NULL,
    role_id integer NOT NULL,
    note text,
    assigned_by uuid NOT NULL REFERENCES auth.users(id),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    organization_id integer NOT NULL
);


--
-- Name: PersonOnConcentration_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."PersonOnConcentration_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PersonRole; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."PersonRole" (
    id integer NOT NULL,
    name text NOT NULL,
    type training_management."PersonRoleType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: PersonRole_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."PersonRole_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Person_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Person_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Sport; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Sport" (
    id integer NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Sport_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Sport_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Tag; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Tag" (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: Tag_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Tag_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Team; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Team" (
    id integer NOT NULL,
    "sportId" integer NOT NULL,
    type training_management."TeamType" NOT NULL,
    room training_management."ManagementRoom" NOT NULL,
    gender training_management."TeamGender" DEFAULT 'MIXED'::training_management."TeamGender" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Team_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Team_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Training; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."Training" (
    id integer NOT NULL,
    location text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    note text NOT NULL,
    concentration_id integer NOT NULL,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isForeign" boolean NOT NULL
);


--
-- Name: TrainingParticipant; Type: TABLE; Schema: training_management; Owner: -
--

CREATE TABLE training_management."TrainingParticipant" (
    participation_id integer NOT NULL,
    training_id integer NOT NULL,
    note text,
    created_by uuid NOT NULL REFERENCES auth.users(id),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Training_id_seq; Type: SEQUENCE; Schema: training_management; Owner: -
--

CREATE SEQUENCE training_management."Training_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Permission id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Permission" ALTER COLUMN id SET DEFAULT nextval('auth."Permission_id_seq"'::regclass);


--
-- Name: Profile id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Profile" ALTER COLUMN id SET DEFAULT nextval('auth."Profile_id_seq"'::regclass);


--
-- Name: Role id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Role" ALTER COLUMN id SET DEFAULT nextval('auth."Role_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."User" ALTER COLUMN id SET DEFAULT nextval('auth."User_id_seq"'::regclass);


--
-- Name: AbsenceRecord id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."AbsenceRecord" ALTER COLUMN id SET DEFAULT nextval('training_management."AbsenceRecord_id_seq"'::regclass);


--
-- Name: Competition id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Competition" ALTER COLUMN id SET DEFAULT nextval('training_management."Competition_id_seq"'::regclass);


--
-- Name: Concentration id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Concentration" ALTER COLUMN id SET DEFAULT nextval('training_management."Concentration_id_seq"'::regclass);


--
-- Name: Organization id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Organization" ALTER COLUMN id SET DEFAULT nextval('training_management."Organization_id_seq"'::regclass);


--
-- Name: Paper id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Paper" ALTER COLUMN id SET DEFAULT nextval('training_management."Paper_id_seq"'::regclass);


--
-- Name: Person id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Person" ALTER COLUMN id SET DEFAULT nextval('training_management."Person_id_seq"'::regclass);


--
-- Name: PersonOnConcentration id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration" ALTER COLUMN id SET DEFAULT nextval('training_management."PersonOnConcentration_id_seq"'::regclass);


--
-- Name: PersonRole id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonRole" ALTER COLUMN id SET DEFAULT nextval('training_management."PersonRole_id_seq"'::regclass);


--
-- Name: Sport id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Sport" ALTER COLUMN id SET DEFAULT nextval('training_management."Sport_id_seq"'::regclass);


--
-- Name: Tag id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Tag" ALTER COLUMN id SET DEFAULT nextval('training_management."Tag_id_seq"'::regclass);


--
-- Name: Team id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Team" ALTER COLUMN id SET DEFAULT nextval('training_management."Team_id_seq"'::regclass);


--
-- Name: Training id; Type: DEFAULT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Training" ALTER COLUMN id SET DEFAULT nextval('training_management."Training_id_seq"'::regclass);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: Profile Profile_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Profile"
    ADD CONSTRAINT "Profile_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY (role_id, permission_id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: UserRole UserRole_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."UserRole"
    ADD CONSTRAINT "UserRole_pkey" PRIMARY KEY (user_id, role_id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: AbsenceRecord AbsenceRecord_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."AbsenceRecord"
    ADD CONSTRAINT "AbsenceRecord_pkey" PRIMARY KEY (id);


--
-- Name: CompetitionParticipant CompetitionParticipant_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."CompetitionParticipant"
    ADD CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY (participation_id, competition_id);


--
-- Name: Competition Competition_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Competition"
    ADD CONSTRAINT "Competition_pkey" PRIMARY KEY (id);


--
-- Name: Concentration Concentration_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Concentration"
    ADD CONSTRAINT "Concentration_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: PaperOnConcentration PaperOnConcentration_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PaperOnConcentration"
    ADD CONSTRAINT "PaperOnConcentration_pkey" PRIMARY KEY (paper_id, concentration_id);


--
-- Name: Paper Paper_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Paper"
    ADD CONSTRAINT "Paper_pkey" PRIMARY KEY (id);


--
-- Name: PersonOnConcentration PersonOnConcentration_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration"
    ADD CONSTRAINT "PersonOnConcentration_pkey" PRIMARY KEY (id);


--
-- Name: PersonRole PersonRole_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonRole"
    ADD CONSTRAINT "PersonRole_pkey" PRIMARY KEY (id);


--
-- Name: Person Person_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Person"
    ADD CONSTRAINT "Person_pkey" PRIMARY KEY (id);


--
-- Name: Sport Sport_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Sport"
    ADD CONSTRAINT "Sport_pkey" PRIMARY KEY (id);


--
-- Name: Tag Tag_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Tag"
    ADD CONSTRAINT "Tag_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id);


--
-- Name: TrainingParticipant TrainingParticipant_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."TrainingParticipant"
    ADD CONSTRAINT "TrainingParticipant_pkey" PRIMARY KEY (participation_id, training_id);


--
-- Name: Training Training_pkey; Type: CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Training"
    ADD CONSTRAINT "Training_pkey" PRIMARY KEY (id);


--
-- Name: Permission_name_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "Permission_name_key" ON auth."Permission" USING btree (name);


--
-- Name: Profile_userId_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "Profile_userId_key" ON auth."Profile" USING btree ("userId");


--
-- Name: Role_name_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "Role_name_key" ON auth."Role" USING btree (name);


--
-- Name: User_email_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON auth."User" USING btree (email);


--
-- Name: AbsenceRecord_startDate_endDate_idx; Type: INDEX; Schema: training_management; Owner: -
--

CREATE INDEX "AbsenceRecord_startDate_endDate_idx" ON training_management."AbsenceRecord" USING btree ("startDate", "endDate");


--
-- Name: Competition_concentration_id_idx; Type: INDEX; Schema: training_management; Owner: -
--

CREATE INDEX "Competition_concentration_id_idx" ON training_management."Competition" USING btree (concentration_id);


--
-- Name: Concentration_teamId_idx; Type: INDEX; Schema: training_management; Owner: -
--

CREATE INDEX "Concentration_teamId_idx" ON training_management."Concentration" USING btree ("teamId");


--
-- Name: Organization_name_type_key; Type: INDEX; Schema: training_management; Owner: -
--

CREATE UNIQUE INDEX "Organization_name_type_key" ON training_management."Organization" USING btree (name, type);


--
-- Name: PersonOnConcentration_concentration_id_idx; Type: INDEX; Schema: training_management; Owner: -
--

CREATE INDEX "PersonOnConcentration_concentration_id_idx" ON training_management."PersonOnConcentration" USING btree (concentration_id);


--
-- Name: PersonOnConcentration_organization_id_idx; Type: INDEX; Schema: training_management; Owner: -
--

CREATE INDEX "PersonOnConcentration_organization_id_idx" ON training_management."PersonOnConcentration" USING btree (organization_id);


--
-- Name: PersonRole_name_key; Type: INDEX; Schema: training_management; Owner: -
--

CREATE UNIQUE INDEX "PersonRole_name_key" ON training_management."PersonRole" USING btree (name);


--
-- Name: Sport_name_key; Type: INDEX; Schema: training_management; Owner: -
--

CREATE UNIQUE INDEX "Sport_name_key" ON training_management."Sport" USING btree (name);


--
-- Name: Tag_name_key; Type: INDEX; Schema: training_management; Owner: -
--

CREATE UNIQUE INDEX "Tag_name_key" ON training_management."Tag" USING btree (name);


--
-- Name: Team_sportId_idx; Type: INDEX; Schema: training_management; Owner: -
--

CREATE INDEX "Team_sportId_idx" ON training_management."Team" USING btree ("sportId");


--
-- Name: Team_sportId_type_gender_key; Type: INDEX; Schema: training_management; Owner: -
--

CREATE UNIQUE INDEX "Team_sportId_type_gender_key" ON training_management."Team" USING btree ("sportId", type, gender);


--
-- Name: Profile Profile_userId_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."Profile"
    ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES auth."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_permission_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."RolePermission"
    ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY (permission_id) REFERENCES auth."Permission"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: RolePermission RolePermission_role_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."RolePermission"
    ADD CONSTRAINT "RolePermission_role_id_fkey" FOREIGN KEY (role_id) REFERENCES auth."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserRole UserRole_role_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."UserRole"
    ADD CONSTRAINT "UserRole_role_id_fkey" FOREIGN KEY (role_id) REFERENCES auth."Role"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: UserRole UserRole_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth."UserRole"
    ADD CONSTRAINT "UserRole_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: AbsenceRecord AbsenceRecord_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."AbsenceRecord"
    ADD CONSTRAINT "AbsenceRecord_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: AbsenceRecord AbsenceRecord_participation_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."AbsenceRecord"
    ADD CONSTRAINT "AbsenceRecord_participation_id_fkey" FOREIGN KEY (participation_id) REFERENCES training_management."PersonOnConcentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CompetitionParticipant CompetitionParticipant_competition_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."CompetitionParticipant"
    ADD CONSTRAINT "CompetitionParticipant_competition_id_fkey" FOREIGN KEY (competition_id) REFERENCES training_management."Competition"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: CompetitionParticipant CompetitionParticipant_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."CompetitionParticipant"
    ADD CONSTRAINT "CompetitionParticipant_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: CompetitionParticipant CompetitionParticipant_participation_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."CompetitionParticipant"
    ADD CONSTRAINT "CompetitionParticipant_participation_id_fkey" FOREIGN KEY (participation_id) REFERENCES training_management."PersonOnConcentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Competition Competition_concentration_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Competition"
    ADD CONSTRAINT "Competition_concentration_id_fkey" FOREIGN KEY (concentration_id) REFERENCES training_management."Concentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Competition Competition_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Competition"
    ADD CONSTRAINT "Competition_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: Concentration Concentration_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Concentration"
    ADD CONSTRAINT "Concentration_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: Concentration Concentration_teamId_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Concentration"
    ADD CONSTRAINT "Concentration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES training_management."Team"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaperOnConcentration PaperOnConcentration_assigned_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PaperOnConcentration"
    ADD CONSTRAINT "PaperOnConcentration_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES auth.users(id);


--
-- Name: PaperOnConcentration PaperOnConcentration_concentration_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PaperOnConcentration"
    ADD CONSTRAINT "PaperOnConcentration_concentration_id_fkey" FOREIGN KEY (concentration_id) REFERENCES training_management."Concentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PaperOnConcentration PaperOnConcentration_paper_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PaperOnConcentration"
    ADD CONSTRAINT "PaperOnConcentration_paper_id_fkey" FOREIGN KEY (paper_id) REFERENCES training_management."Paper"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Paper Paper_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Paper"
    ADD CONSTRAINT "Paper_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: PersonOnConcentration PersonOnConcentration_assigned_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration"
    ADD CONSTRAINT "PersonOnConcentration_assigned_by_fkey" FOREIGN KEY (assigned_by) REFERENCES auth.users(id);


--
-- Name: PersonOnConcentration PersonOnConcentration_concentration_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration"
    ADD CONSTRAINT "PersonOnConcentration_concentration_id_fkey" FOREIGN KEY (concentration_id) REFERENCES training_management."Concentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PersonOnConcentration PersonOnConcentration_organization_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration"
    ADD CONSTRAINT "PersonOnConcentration_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES training_management."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PersonOnConcentration PersonOnConcentration_person_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration"
    ADD CONSTRAINT "PersonOnConcentration_person_id_fkey" FOREIGN KEY (person_id) REFERENCES training_management."Person"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PersonOnConcentration PersonOnConcentration_role_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."PersonOnConcentration"
    ADD CONSTRAINT "PersonOnConcentration_role_id_fkey" FOREIGN KEY (role_id) REFERENCES training_management."PersonRole"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Team Team_sportId_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Team"
    ADD CONSTRAINT "Team_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES training_management."Sport"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingParticipant TrainingParticipant_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."TrainingParticipant"
    ADD CONSTRAINT "TrainingParticipant_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- Name: TrainingParticipant TrainingParticipant_participation_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."TrainingParticipant"
    ADD CONSTRAINT "TrainingParticipant_participation_id_fkey" FOREIGN KEY (participation_id) REFERENCES training_management."PersonOnConcentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingParticipant TrainingParticipant_training_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."TrainingParticipant"
    ADD CONSTRAINT "TrainingParticipant_training_id_fkey" FOREIGN KEY (training_id) REFERENCES training_management."Training"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Training Training_concentration_id_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Training"
    ADD CONSTRAINT "Training_concentration_id_fkey" FOREIGN KEY (concentration_id) REFERENCES training_management."Concentration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Training Training_created_by_fkey; Type: FK CONSTRAINT; Schema: training_management; Owner: -
--

ALTER TABLE ONLY training_management."Training"
    ADD CONSTRAINT "Training_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id);


--
-- PostgreSQL database dump complete
--

