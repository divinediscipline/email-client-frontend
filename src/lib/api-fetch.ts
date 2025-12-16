// Alternative API using fetch instead of axios to handle compression issues
const API_BASE_URL = 'https://test-api.squadinc.co/email-list/v1';

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`=== FETCH REQUEST ===`);
  console.log(`URL: ${url}`);
  console.log(`Method: ${options.method || 'GET'}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'omit',
    });
    
    console.log(`=== FETCH RESPONSE ===`);
    console.log(`Status: ${response.status}`);
    console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Data:`, data);
    
    return { data, status: response.status };
  } catch (error) {
    console.error(`=== FETCH ERROR ===`, error);
    throw error;
  }
}

export const emailsAPI = {
  getEmails: async (params?: {
    page?: number;
    limit?: number;
    view?: string;
    search?: string;
    labels?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    return fetchAPI(`/api/emails${query ? `?${query}` : ''}`);
  },
  
  getEmailCounts: () => fetchAPI('/api/emails/counts'),
  
  getLabels: () => fetchAPI('/api/emails/labels'),
  
  toggleStar: (id: string) => 
    fetchAPI(`/api/emails/${id}/star`, { method: 'PATCH' }),
};

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  getProfile: () => fetchAPI('/api/auth/profile'),
  
  logout: () => fetchAPI('/api/auth/logout', { method: 'POST' }),
};
