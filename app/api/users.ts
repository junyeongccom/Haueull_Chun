// Swagger API에서 사용자 데이터를 가져오는 함수

// 사용자 데이터 타입 정의
export interface User {
  user_id: string;
  email: string;
  password: string;
  name: string;
}

// 사용자 등록 요청 타입
export interface CreateUserRequest {
  user_id: string;
  email: string;
  password: string;
  name: string;
}

// 로그인 요청 타입
export interface LoginRequest {
  user_id: string;
  password: string;
}

// API 기본 URL
const API_BASE_URL = 'http://localhost:8000';

// 개발 환경에서 사용할 샘플 사용자 데이터 제거

/**
 * 모든 사용자 데이터를 가져오는 함수
 * @returns {Promise<User[]>} 사용자 배열
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return data.customers || [];
  } catch (error) {
    console.error('사용자 데이터 가져오기 실패:', error);
    return []; // 오류 발생 시 빈 배열 반환
  }
}

/**
 * 특정 사용자 데이터를 가져오는 함수
 * @param {string} userId 사용자 ID
 * @returns {Promise<User | null>} 사용자 객체 또는 null
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`사용자 ID ${userId} 가져오기 실패:`, error);
    return null;
  }
}

/**
 * 새 사용자를 등록하는 함수
 * @param {CreateUserRequest} userData 등록할 사용자 데이터
 * @returns {Promise<User | null>} 등록된 사용자 객체 또는 null
 */
export async function createUser(userData: CreateUserRequest): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('사용자 등록 실패:', error);
    return null;
  }
}

/**
 * 사용자 로그인 함수
 * @param {LoginRequest} loginData 로그인 데이터
 * @returns {Promise<User | null>} 로그인 성공 시 사용자 정보, 실패 시 null
 */
export async function loginUser(loginData: LoginRequest): Promise<User | null> {
  try {
    // 먼저 모든 사용자 목록을 가져옵니다
    const users = await getUsers();
    
    // 사용자 ID와 비밀번호가 일치하는 사용자를 찾습니다
    const user = users.find(
      (user) => user.user_id === loginData.user_id && user.password === loginData.password
    );
    
    if (!user) {
      return null; // 일치하는 사용자가 없으면 null 반환
    }
    
    return user; // 일치하는 사용자가 있으면 사용자 정보 반환
  } catch (error) {
    console.error('로그인 실패:', error);
    return null;
  }
}

/**
 * 사용자 삭제 함수
 * @param {string} userId 삭제할 사용자 ID
 * @returns {Promise<boolean>} 삭제 성공 여부
 */
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`사용자 ID ${userId} 삭제 실패:`, error);
    return false;
  }
} 