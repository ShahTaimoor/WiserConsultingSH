// Admin service layer - all admin API calls
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ============ Users Service ========
export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: number;
  createdAt: string;
}

export interface UsersResponse {
  users: AdminUser[];
}

export const fetchAllUsers = async (): Promise<UsersResponse> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/all-users`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  // Backend returns { success: true, data: { users: [...] }, meta: {...} }
  return {
    users: data.data?.users || data.users || []
  };
};

export const updateUserRole = async (userId: string, role: number): Promise<void> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/update-user-role/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    credentials: 'include',
    body: JSON.stringify({ role })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update user role');
  }
};

// ============ Form Submissions Service ============
export interface FormSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  destinationCountry: string;
  otherCountry?: string;
  visaType: string;
  fromDate: string;
  toDate: string;
  purpose: string;
  status: string;
  documents: Document[];
  adminComments?: AdminComment[];
  customerComments?: CustomerComment[];
  createdAt: string;
}

export interface Document {
  _id: string;
  fieldName: string;
  originalname: string;
  filename?: string;
  cloudinaryUrl?: string;
  mimetype: string;
  size: number;
  comment?: string;
}

export interface AdminComment {
  documentId: string;
  documentName: string;
  comment: string;
  createdAt: string;
}

export interface CustomerComment {
  message: string;
  createdAt: string;
}

export interface FormSubmissionsResponse {
  submissions: FormSubmission[];
}

export const fetchFormSubmissions = async (): Promise<FormSubmissionsResponse> => {
  const response = await fetch(`${API_URL}/form-submissions`, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch form submissions');
  }

  return await response.json();
};

export const updateSubmissionStatus = async (submissionId: string, status: string): Promise<void> => {
  const response = await fetch(`${API_URL}/form-submissions/${submissionId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error('Failed to update submission status');
  }
};

export const saveDocumentComment = async (
  submissionId: string,
  documentId: string,
  comment: string
): Promise<void> => {
  const response = await fetch(`${API_URL}/${submissionId}/documents/${documentId}/comment`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ comment })
  });

  if (!response.ok) {
    throw new Error('Failed to save comment');
  }
};

export const deleteDocument = async (submissionId: string, documentId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/form-submissions/${submissionId}/documents/${documentId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete document');
  }
};

export const deleteSubmission = async (submissionId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/form-submissions/${submissionId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete submission');
  }
};

// ============ PDF Operations Service ============
export interface MergePDFsRequest {
  submissionId: string;
  documentIds: string[];
  customerName: string;
  customerEmail: string;
}

export interface CompressPDFsRequest {
  submissionId: string;
  documentIds: string[];
  compressionLevel: 'low' | 'medium' | 'high' | '5mb';
  customerName: string;
}

export const mergePDFs = async (request: MergePDFsRequest): Promise<Blob> => {
  const response = await fetch(`${API_URL}/merge-pdfs`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to merge PDFs');
  }

  return await response.blob();
};

export const compressPDFs = async (request: CompressPDFsRequest): Promise<Blob> => {
  const response = await fetch(`${API_URL}/compress-pdfs`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Failed to compress PDFs');
  }

  return await response.blob();
};

