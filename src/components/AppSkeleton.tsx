import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';

export const AppSkeleton: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Skeleton.Input style={{ width: 200, marginBottom: 16 }} active />
      <Skeleton.Input style={{ width: 400, marginBottom: 24 }} active />
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Skeleton active paragraph={{ rows: 2 }} />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 24 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    </div>
  );
};
