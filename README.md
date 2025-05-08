# Form Builder

A dynamic drag-and-drop form builder built with React, TypeScript, and DND Kit. This application allows users to create, customize, and manage complex forms through an intuitive interface.

## Features

- **Drag and Drop Interface**: Create forms by dragging fields from a palette to the canvas
- **Multiple Field Types**:
  - Text Input
  - Number Input
  - Combobox (Single Select)
  - Number Combobox
  - Radio Buttons
  - Checkboxes
  - Date Picker
  - Labels
  - Text Area
- **Field Properties**:
  - Custom labels
  - Placeholders
  - Required/Optional fields
  - Min/Max values for number inputs
  - Custom options for select fields
  - Default values
- **Fieldset Management**:
  - Group fields into fieldsets
  - Rename fieldsets
  - Delete fieldsets
- **Field Operations**:
  - Duplicate fields
  - Delete fields
  - Reorder fields via drag and drop
  - Move fields between fieldsets
- **Form Preview**: Preview the form in a modal to see how it will appear to end users
- **Form Persistence**: Save and load forms via API

## Technologies Used

- React
- TypeScript
- [@dnd-kit/core](https://github.com/clauderic/dnd-kit) - Drag and Drop functionality
- [@dnd-kit/sortable](https://github.com/clauderic/dnd-kit) - Sortable functionality
- [UUID](https://github.com/uuidjs/uuid) - Unique ID generation
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Getting Started

1. Clone the repository
2. Install dependencies
3. Start the development server

```bash
npm install
npm run dev
```

## Usage

1. **Creating Fields**:
   - Drag field types from the left panel onto the canvas
   - Fields will automatically be placed in a new fieldset if dropped on an empty canvas

2. **Customizing Fields**:
   - Click on a field to edit its properties in the right panel
   - Modify labels, names, placeholders, and other field-specific properties

3. **Managing Fieldsets**:
   - Click on a fieldset to edit its properties
   - Drag fields between fieldsets to reorganize
   - Delete empty fieldsets automatically

4. **Previewing Forms**:
   - Click the "Preview Form" button to see how your form will appear to users

5. **Saving Forms**:
   - Click "Save Form" to persist your form configuration
   - Forms are automatically loaded when the builder is opened

## API Integration

The form builder integrates with a REST API for saving and loading forms:

- **Save Form**: POST request to save the current form configuration
- **Load Form**: GET request to retrieve saved form configuration

