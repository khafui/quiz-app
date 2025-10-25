'use client';
import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Banner from "@/components/banner";
const QuestionForm = dynamic(() => import('@/components/forms/question-form'), { ssr: false });
const BulkUpload = dynamic(() => import('@/components/bulk-upload'), { ssr: false });

export default function NewQuestionPage() {
  return (
    // <div className="space-y-6">
    //   <div>
    //     <h1 className="text-xl font-semibold mb-4">Add Question</h1>
    //     <QuestionForm />
    //   </div>
    //   <div>
    //     <h2 className="text-lg font-semibold mb-2">Or Bulk Upload</h2>
    //     <BulkUpload />
    //   </div>
    // </div>
      <div>
          <Banner title="Questions" />
          <div className="space-y-6 max-w-7xl mx-auto">
              <h1 className="text-xl font-semibold mb-4">Add Questions</h1>

              <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg">
                      <TabsTrigger value="manual">Add Manually</TabsTrigger>
                      <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="pt-4">
                      <QuestionForm />
                  </TabsContent>

                  <TabsContent value="bulk" className="pt-4">
                      <BulkUpload />
                  </TabsContent>
              </Tabs>
          </div>
      </div>
  );
}
