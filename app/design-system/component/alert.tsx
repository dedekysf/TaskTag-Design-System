import { Alert } from '@/components/Alert';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function AlertScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Alert" totalItems={4} />

                {/* Warning Alert */}
                <ComponentSection
                    title="Warning"
                    githubUrls={[
                        {
                            label: 'Alert',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Alert.tsx'
                        }
                    ]}
                    usageCode={`export default function Example() {
  return (
    <Alert
      variant="warning"
      title="Access to Team Plan for TaskTag Project has ended"
      description="Your access ended on September 17, 2025. Upgrade to a Team plan to use advanced project features."
      buttonText="Upgrade Now"
      onButtonClick={() => {}}
    />
  );
}`}
                >
                    <Alert
                        variant="warning"
                        title="Access to Team Plan for TaskTag Project has ended"
                        description="Your access ended on September 17, 2025. Upgrade to a Team plan to use advanced project features."
                        buttonText="Upgrade Now"
                        onButtonClick={() => console.log('Upgrade clicked')}
                    />
                </ComponentSection>

                {/* Info Alert */}
                <ComponentSection
                    title="Info"
                    githubUrls={[
                        {
                            label: 'Alert',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Alert.tsx'
                        }
                    ]}
                    usageCode={`export default function Example() {
  return (
    <Alert
      variant="info"
      title="New features available"
      description="Check out the latest updates to improve your workflow and productivity."
      buttonText="Learn More"
      onButtonClick={() => {}}
    />
  );
}`}
                >
                    <Alert
                        variant="info"
                        title="New features available"
                        description="Check out the latest updates to improve your workflow and productivity."
                        buttonText="Learn More"
                        onButtonClick={() => console.log('Learn more clicked')}
                    />
                </ComponentSection>

                {/* Success Alert */}
                <ComponentSection
                    title="Success"
                    githubUrls={[
                        {
                            label: 'Alert',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Alert.tsx'
                        }
                    ]}
                    usageCode={`export default function Example() {
  return (
    <Alert
      variant="success"
      title="Your plan has been upgraded successfully"
      description="You now have access to all Team Plan features. Start collaborating with your team."
      buttonText="Get Started"
      onButtonClick={() => {}}
    />
  );
}`}
                >
                    <Alert
                        variant="success"
                        title="Your plan has been upgraded successfully"
                        description="You now have access to all Team Plan features. Start collaborating with your team."
                        buttonText="Get Started"
                        onButtonClick={() => console.log('Get started clicked')}
                    />
                </ComponentSection>

                {/* Error Alert */}
                <ComponentSection
                    title="Error"
                    githubUrls={[
                        {
                            label: 'Alert',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Alert.tsx'
                        }
                    ]}
                    usageCode={`export default function Example() {
  return (
    <Alert
      variant="error"
      title="Unable to process your request"
      description="There was an error processing your payment. Please try again or contact support."
      buttonText="Try Again"
      onButtonClick={() => {}}
    />
  );
}`}
                >
                    <Alert
                        variant="error"
                        title="Unable to process your request"
                        description="There was an error processing your payment. Please try again or contact support."
                        buttonText="Try Again"
                        onButtonClick={() => console.log('Try again clicked')}
                    />
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
