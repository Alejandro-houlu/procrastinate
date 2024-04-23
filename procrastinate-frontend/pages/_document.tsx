import Document, { DocumentContext } from 'next/document';
import { JSX } from 'react';
import { ServerStyleSheet } from 'styled-components';

interface MyDocumentContext extends DocumentContext {
  renderPage: any;
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: MyDocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () => 
        originalRenderPage({
          enhanceApp: (App: any) => (props: JSX.IntrinsicAttributes) => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }
}
