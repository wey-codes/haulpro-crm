# Task: Photo Upload & Storage

**Status:** pending
**Phase:** 1 - Lead Management
**Depends On:** 01-03-lead-detail
**Estimated Time:** 2 hours

---

## 1. Overview

Enable photo uploads for leads using Supabase Storage. Display photos in a gallery on the lead detail page.

## 2. Goals

- Create Supabase Storage bucket for lead photos
- Build drag-and-drop upload component
- Display photo gallery with thumbnails
- Enable photo deletion

## 3. User Stories

### 3.1 User can upload photos
**As a** sales rep
**I want** to upload customer photos to a lead
**So that** I can reference them when quoting

**Acceptance Criteria:**
- [ ] Drag-and-drop upload zone on lead detail page
- [ ] Can also click to select files
- [ ] Supports multiple files at once
- [ ] Shows upload progress
- [ ] Photos appear in gallery after upload

### 3.2 User can view photos
**As a** sales rep
**I want** to see all photos for a lead
**So that** I can assess the job scope

**Acceptance Criteria:**
- [ ] Thumbnail gallery displays all photos
- [ ] Click thumbnail to view full size (modal)
- [ ] Photos persist after page refresh

### 3.3 User can delete photos
**As a** sales rep
**I want** to remove incorrect photos
**So that** I keep only relevant images

**Acceptance Criteria:**
- [ ] Delete button on each photo
- [ ] Confirmation before delete
- [ ] Photo removed from storage and database

## 4. Functional Requirements

**FR-1:** Create Supabase Storage bucket:
- Name: `lead-photos`
- Public: No (use signed URLs)
- File size limit: 10MB
- Allowed types: image/jpeg, image/png, image/webp

**FR-2:** Create Storage RLS policy:
```sql
-- Allow authenticated users to upload to their account's folder
CREATE POLICY "Users can upload lead photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lead-photos' AND
  (storage.foldername(name))[1] = (SELECT account_id::text FROM users WHERE auth_user_id = auth.uid())
);
```

**FR-3:** Create upload component at `src/components/leads/photo-upload.tsx`:
- Drag-and-drop zone
- Click to select files
- Multiple file support
- Progress indicator per file
- Error handling

**FR-4:** Create photo gallery component at `src/components/leads/photo-gallery.tsx`:
- Grid of thumbnails
- Click to enlarge
- Delete button on hover
- Empty state when no photos

**FR-5:** Update leads table to store photo URLs:
- Photos stored as array: `photos TEXT[]`
- Already in schema, just need to update

**FR-6:** Server Actions at `src/app/(dashboard)/leads/[id]/photo-actions.ts`:
```typescript
'use server'

export async function uploadPhoto(leadId: string, formData: FormData) {
  // Upload to storage
  // Add URL to lead.photos array
}

export async function deletePhoto(leadId: string, photoUrl: string) {
  // Remove from storage
  // Remove URL from lead.photos array
}
```

**FR-7:** File path structure:
```
lead-photos/{account_id}/{lead_id}/{filename}
```

## 5. Non-Goals

- No image optimization/resizing (use as-is)
- No image editing
- No drag-to-reorder

## 6. Technical Considerations

- Use signed URLs for private access
- Store relative paths in DB, generate signed URLs on fetch
- Handle upload errors gracefully
- Consider lazy loading for galleries with many photos

## 7. Acceptance Criteria (Verification)

```bash
npm run build        # No build errors
npm run typecheck    # No TypeScript errors
```

Manual testing:
1. Go to lead detail page
2. Drag photo onto upload zone → see progress → photo appears
3. Click upload zone, select 3 files → all upload and appear
4. Click photo → opens in modal at full size
5. Click delete → confirmation → photo removed
6. Refresh page → photos still there
7. Upload 10MB+ file → error message shown

Supabase verification:
- Check Storage bucket has uploaded files
- Check lead record has photo URLs in array

## 8. Output Files

```
src/components/leads/
├── photo-upload.tsx         # Upload dropzone
├── photo-gallery.tsx        # Thumbnail grid
└── photo-modal.tsx          # Full-size viewer

src/app/(dashboard)/leads/[id]/
└── photo-actions.ts         # Upload/delete actions

src/lib/supabase/
└── storage.ts               # Storage utility functions
```

---

## Implementation Notes

Create storage bucket via Supabase dashboard:
1. Go to Storage
2. Create bucket "lead-photos"
3. Set to private
4. Add RLS policies

Example upload:
```typescript
const { data, error } = await supabase.storage
  .from('lead-photos')
  .upload(`${accountId}/${leadId}/${file.name}`, file)
```

Example signed URL:
```typescript
const { data } = await supabase.storage
  .from('lead-photos')
  .createSignedUrl(path, 3600) // 1 hour expiry
```
