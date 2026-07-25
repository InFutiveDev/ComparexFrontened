import { API_BASE_URL, ApiError, apiFetch, apiFormFetch } from "@/lib/api";
import {
  clearAuthSession,
  getStoredRefreshToken,
  getStoredToken,
  refreshAccessToken,
} from "@/lib/auth";

function isExpiredAccessTokenError(error) {
  return (
    error instanceof ApiError &&
    error.status === 401 &&
    /invalid or expired token/i.test(error.message)
  );
}

async function withAuthRetry(request, retried = false) {
  try {
    return await request(getStoredToken());
  } catch (error) {
    if (!retried && isExpiredAccessTokenError(error) && getStoredRefreshToken()) {
      try {
        await refreshAccessToken();
      } catch {
        clearAuthSession();
        throw error;
      }
      return withAuthRetry(request, true);
    }

    if (isExpiredAccessTokenError(error)) {
      clearAuthSession();
    }

    throw error;
  }
}

export function authApiFetch(path, options = {}) {
  return withAuthRetry((token) => {
    if (!token) {
      throw new ApiError("Authentication required", 401);
    }

    return apiFetch(path, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  });
}

export function authApiFormFetch(path, formData, options = {}) {
  return withAuthRetry((token) => {
    if (!token) {
      throw new ApiError("Authentication required", 401);
    }

    return apiFormFetch(path, formData, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
  });
}

export async function authApiRequest(path, options = {}, retried = false) {
  const token = getStoredToken();
  if (!token) {
    throw new ApiError("Authentication required", 401);
  }

  const url = path.startsWith("http")
    ? path
    : `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (response.status === 401 && !retried && getStoredRefreshToken()) {
    let message = "";
    try {
      const data = await response.clone().json();
      message = data?.message || "";
    } catch {
      message = "";
    }

    if (/invalid or expired token/i.test(message)) {
      await refreshAccessToken();
      return authApiRequest(path, options, true);
    }
  }

  if (response.status === 401) {
    clearAuthSession();
    throw new ApiError("Invalid or expired token", 401);
  }

  return response;
}
