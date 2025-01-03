import React from 'react';
import { Command } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

interface WrongBrowserNoticeProps {
  code: string;
}

const WrongBrowserNotice: React.FC<WrongBrowserNoticeProps> = ({ code }) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex aspect-square h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Command className="h-6 w-6" />
            </div>
          </div>
          <CardTitle>Different Browser Detected</CardTitle>
          <CardDescription>
            Please enter this verification code in the browser where you started signing in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 p-4">
            <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-lg">
              {code}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
            >
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WrongBrowserNotice;