-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    full_name TEXT,
    avatar_url TEXT
);

-- Create projects table
CREATE TABLE projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('active', 'completed', 'on_hold')) DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    owner_id UUID REFERENCES profiles(id) NOT NULL
);

-- Create tasks table
CREATE TABLE tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK (status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
    due_date TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES profiles(id),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE
);

-- Create documents table
CREATE TABLE documents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT CHECK (type IN ('document', 'spreadsheet', 'presentation')) DEFAULT 'document',
    owner_id UUID REFERENCES profiles(id) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

-- Create events table
CREATE TABLE events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES profiles(id) NOT NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

-- Create RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Projects are viewable by owner" ON projects
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Projects are insertable by owner" ON projects
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Projects are updatable by owner" ON projects
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Projects are deletable by owner" ON projects
    FOR DELETE USING (auth.uid() = owner_id);

-- Tasks policies
CREATE POLICY "Tasks are viewable by project owner or assignee" ON tasks
    FOR SELECT USING (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = project_id
            UNION
            SELECT assigned_to WHERE assigned_to = auth.uid()
        )
    );

CREATE POLICY "Tasks are insertable by project owner" ON tasks
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = project_id
        )
    );

CREATE POLICY "Tasks are updatable by project owner or assignee" ON tasks
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT owner_id FROM projects WHERE id = project_id
            UNION
            SELECT assigned_to WHERE assigned_to = auth.uid()
        )
    );

-- Documents policies
CREATE POLICY "Documents are viewable by owner" ON documents
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Documents are insertable by owner" ON documents
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Documents are updatable by owner" ON documents
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Documents are deletable by owner" ON documents
    FOR DELETE USING (auth.uid() = owner_id);

-- Events policies
CREATE POLICY "Events are viewable by owner" ON events
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Events are insertable by owner" ON events
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Events are updatable by owner" ON events
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Events are deletable by owner" ON events
    FOR DELETE USING (auth.uid() = owner_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
