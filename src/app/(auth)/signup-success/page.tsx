import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">인증 메일이 전송되었습니다!</CardTitle>
          <CardDescription className="text-base">
            입력하신 이메일 주소로 인증 메일을 보냈습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium">다음 단계를 완료해주세요:</p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>이메일 받은편지함을 확인하세요</li>
                  <li>인증 메일의 "이메일 인증하기" 버튼을 클릭하세요</li>
                  <li>인증이 완료되면 로그인할 수 있습니다</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              메일이 도착하지 않았나요?
            </p>
            <div className="text-xs text-center text-muted-foreground space-y-1">
              <p>• 스팸 메일함을 확인해주세요</p>
              <p>• 이메일 주소가 올바른지 확인해주세요</p>
              <p>• 몇 분 후에 다시 시도해주세요</p>
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/login">
                로그인 페이지로 이동
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}