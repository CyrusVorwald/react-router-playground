import { Link } from 'react-router';
import { XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

const ExpiredLinkNotice = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle>Link Has Expired</CardTitle>
          <CardDescription>
            This verification link is no longer valid
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/login">Return to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpiredLinkNotice;