import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('에러 발생:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
          padding={2}
        >
          <Typography variant="h5" gutterBottom color="error">
            오류가 발생했습니다
          </Typography>
          <Typography variant="body1" gutterBottom textAlign="center" color="text.secondary">
            예상치 못한 문제가 발생했습니다.
            <br />
            페이지를 새로고침하거나 잠시 후 다시 시도해 주세요.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={this.handleReload}
            sx={{ mt: 2 }}
          >
            페이지 새로고침
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;