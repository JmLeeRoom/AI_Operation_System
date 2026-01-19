-- Migration: Initialize database schema for Data Pipeline
-- Only Flow and Object tables (Python nodes only)

-- Create flows table
CREATE TABLE IF NOT EXISTS flows (
    f_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastest_run TIMESTAMP,
    run_type VARCHAR(255),
    created_by BIGINT,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create objects table
CREATE TABLE IF NOT EXISTS objects (
    o_id BIGSERIAL PRIMARY KEY,
    type VARCHAR(255),
    x BIGINT,
    y BIGINT,
    label VARCHAR(255),
    params TEXT,
    target BIGINT,
    flow BIGINT,
    CONSTRAINT fk_flows FOREIGN KEY (flow) REFERENCES flows(f_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flows_created_by ON flows(created_by);
CREATE INDEX IF NOT EXISTS idx_objects_flow ON objects(flow);
