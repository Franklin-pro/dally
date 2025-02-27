export interface BlogImage {
    url: string;
  }
  
  export interface Blogs {
    _id: string;
    id: string;
    blogName: string;
    blogDescription: string;
    blogStatus: string;
    url: string;
    blogImage?: BlogImage | undefined; // Optional BlogImage object
  }
  