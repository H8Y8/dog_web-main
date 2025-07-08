import { NextRequest } from 'next/server'
import { 
  apiSuccess, 
  apiError, 
  methodNotAllowed,
  validateRequestBody
} from '@/lib/api-utils'

// POST /api/contact - 提交聯絡表單
export async function POST(request: NextRequest) {
  try {
    // 驗證請求體
    const requiredFields = ['name', 'email', 'message']
    const { isValid, body, error: validationError } = await validateRequestBody(request, requiredFields)
    
    if (!isValid) {
      return apiError(validationError!, 'VALIDATION_ERROR', 400)
    }

    // 驗證 email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return apiError('請提供有效的 email 地址', 'INVALID_EMAIL', 400)
    }

    // 準備聯絡資料
    const contactData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim(),
      subject: body.subject?.trim() || '網站聯絡表單',
      message: body.message.trim(),
      submitted_at: new Date().toISOString()
    }

    // 這裡可以整合 email 服務（如 SendGrid、Resend 等）
    // 目前先記錄到 console 並回傳成功
    console.log('Contact form submission:', contactData)

    // TODO: 可以選擇將聯絡資料存到資料庫或發送 email
    // 可能的實作方式：
    // 1. 儲存到 Supabase 的 contact_submissions 表格
    // 2. 發送 email 通知給管理員
    // 3. 自動回覆給用戶

    return apiSuccess(
      { 
        id: Date.now().toString(), // 臨時 ID
        submitted: true 
      }, 
      '您的訊息已成功送出，我們會盡快回覆您'
    )

  } catch (error) {
    console.error('POST /api/contact error:', error)
    return apiError('提交聯絡表單失敗', 'CONTACT_SUBMISSION_ERROR', 500)
  }
}

// 處理不支援的 HTTP 方法
export async function GET() {
  return methodNotAllowed(['POST'])
}

export async function PUT() {
  return methodNotAllowed(['POST'])
}

export async function DELETE() {
  return methodNotAllowed(['POST'])
}

export async function PATCH() {
  return methodNotAllowed(['POST'])
} 