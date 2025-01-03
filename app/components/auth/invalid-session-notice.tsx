import { Link } from 'react-router';
import { AlertOctagon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

const InvalidSessionNotice = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertOctagon className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Session Expired</CardTitle>
          <CardDescription>
            Your verification session has expired or is invalid.
            Please start over to receive a new code.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/login">Start Over</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvalidSessionNotice;