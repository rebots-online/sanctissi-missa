# Sanctissi Missa Architecture

## Repository Structure

This document outlines the architectural decisions and structure of the Sanctissi Missa project.

### Overview

The project is organized as a parent repository with two key submodules:

```
sanctissi-missa/
├── reference/                 # Original Divinum Officium (Perl)
├── typescript-app/           # Modern TypeScript Implementation
└── docs/                    # Project Documentation
```

### Design Decisions

#### 1. Parent Repository Pattern
- Main repository serves as an organizational wrapper
- Maintains clear separation between reference and implementation
- Provides centralized documentation and project management

#### 2. Submodule Structure
- **Reference Implementation** (`/reference`)
  - Original Divinum Officium Perl codebase
  - Used solely as functional reference
  - Maintains clear licensing boundaries
  
- **TypeScript Implementation** (`/typescript-app`)
  - Clean-room implementation in TypeScript/React Native
  - Modern architecture and development practices
  - Independent, non-derivative codebase

#### 3. Clean Room Implementation
- Complete separation from original codebase
- Independent development approach
- Modern architectural patterns
- TypeScript/React Native stack

#### 4. Documentation Strategy
- Centralized documentation in `/docs`
- Clear architectural guidelines
- Development standards and practices
- API documentation

## Implementation Details

### Technology Stack
- TypeScript
- React Native
- Modern development tools and practices

### Development Guidelines
1. Maintain strict separation between reference and implementation
2. Document all major architectural decisions
3. Follow modern development practices
4. Maintain comprehensive test coverage

## License and Attribution

Copyright (C)2025 Robin L. M. Cheung, MBA

All rights reserved.

This architecture ensures clear separation between the reference implementation and our modern rewrite, maintaining proper licensing boundaries while enabling efficient development.