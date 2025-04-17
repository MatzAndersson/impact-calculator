from http.server import BaseHTTPRequestHandler, HTTPServer
from string import Template

class Handler(BaseHTTPRequestHandler):
    def _set_response(self, content_type='text/html'):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.end_headers()

    def do_GET(self):
        path = self.path
        if path == '' or path == '/' or path == '/index.html':
            self._serve_index()
        else:
            self._serve_file()

    def _serve_index(self):
        with open('index.html', 'r') as page_content_file:
            page_content = page_content_file.read()
        with open('template.html', 'r') as template_file:
            template_content = template_file.read()

        template = Template(template_content)
        rendered_template = template.substitute({'content': page_content})

        self._set_response()
        self.wfile.write(rendered_template.encode('utf-8'))

    def _serve_file(self):
        try:
            file_path = self.path[1:]  # Remove leading '/'
            with open(file_path, 'rb') as file:
                content_type = self._get_content_type(file_path)
                self._set_response(content_type)
                self.wfile.write(file.read())
        except IOError:
            self.send_error(404, 'File Not Found: {}'.format(self.path))

    def _get_content_type(self, file_path):
        content_types = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.pdf': 'application/pdf'
        }
        file_extension = file_path[file_path.rfind('.'):]
        return content_types.get(file_extension, 'application/octet-stream')


def run(server_class=HTTPServer, handler_class=Handler, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f'Starting server on port {port}...')
    httpd.serve_forever()

if __name__ == '__main__':
    run()
