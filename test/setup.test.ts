import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Project Setup', () => {
  it('should have package.json with required dependencies', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '../package.json'), 'utf-8')
    );

    expect(pkg.dependencies).toHaveProperty('@modelcontextprotocol/sdk');
    expect(pkg.dependencies).toHaveProperty('express');
    expect(pkg.dependencies).toHaveProperty('zod');
  });

  it('should have required dev dependencies', () => {
    const pkg = JSON.parse(
      readFileSync(resolve(__dirname, '../package.json'), 'utf-8')
    );

    expect(pkg.devDependencies).toHaveProperty('vitest');
    expect(pkg.devDependencies).toHaveProperty('typescript');
    expect(pkg.devDependencies).toHaveProperty('supertest');
  });

  it('should have valid render.yaml with web service config', () => {
    const renderYaml = readFileSync(
      resolve(__dirname, '../render.yaml'),
      'utf-8'
    );

    expect(renderYaml).toContain('type: web');
    expect(renderYaml).toContain('buildCommand');
    expect(renderYaml).toContain('startCommand');
    expect(renderYaml).toContain('healthCheckPath: /health');
  });
});
