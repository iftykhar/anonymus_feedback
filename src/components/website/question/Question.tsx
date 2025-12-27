import { Card } from '@/components/ui/card';
import React from 'react'

const Question = () => {
  return (
    <div>
      Question Component
      <div className="question">
        <Card>
          <h2>What is the capital of France?</h2>
          <ul>
            <li>A) Berlin</li>
            <li>B) Madrid</li>
            <li>C) Paris</li>
            <li>D) Rome</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default Question