# Sanctissi Missa

A modern implementation of Roman Catholic liturgical calculations and presentations.

## Architecture

This repository follows a modular architecture with clear separation of concerns:

### Repository Structure

```
sanctissi-missa/
├── reference/                 # Submodule: Original Divinum Officium (Perl) as reference
├── typescript-app/           # Submodule: Our modern TypeScript/React Native implementation
├── docs/                    # Project documentation
└── README.md               # This file
```

### Design Philosophy

- **Clean Room Implementation**: Our TypeScript implementation is a completely new, non-derivative work
- **Reference Only**: The original Divinum Officium codebase is included as a reference submodule only
- **Modern Architecture**: Built using TypeScript, React Native, and modern development practices
- **Clear Separation**: Strict separation between reference material and our implementation

## License

Copyright (C)2025 Robin L. M. Cheung, MBA

All rights reserved.

## Relationship to Divinum Officium

While this project serves similar liturgical purposes as Divinum Officium:
- It is a completely independent implementation
- Not derived from or dependent on the original Perl codebase
- Uses the original only as functional reference
- Implements modern architectural patterns and practices