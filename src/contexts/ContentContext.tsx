import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ContentBlock = Database['public']['Tables']['content_blocks']['Row'];

interface ContentContextType {
  contentBlocks: Map<string, ContentBlock>;
  getContent: (slug: string, defaultValue: string) => string;
  refreshContent: () => Promise<void>;
  loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [contentBlocks, setContentBlocks] = useState<Map<string, ContentBlock>>(new Map());
  const [loading, setLoading] = useState(true);

  const loadContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*');

      if (error) {
        console.error('Error loading content:', error);
        return;
      }

      if (data) {
        const contentMap = new Map<string, ContentBlock>();
        data.forEach((block) => {
          contentMap.set(block.slug, block);
        });
        setContentBlocks(contentMap);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const getContent = (slug: string, defaultValue: string): string => {
    const block = contentBlocks.get(slug);
    return block?.value || defaultValue;
  };

  const refreshContent = async () => {
    await loadContent();
  };

  return (
    <ContentContext.Provider value={{ contentBlocks, getContent, refreshContent, loading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (slug: string, defaultValue: string = ''): string => {
  const context = useContext(ContentContext);
  if (!context) {
    return defaultValue;
  }
  return context.getContent(slug, defaultValue);
};

export const useContentRefresh = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContentRefresh must be used within ContentProvider');
  }
  return context.refreshContent;
};
