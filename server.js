var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if(!port){
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function(request, response){
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    let status_code = response.statusCode;

    console.log('有个傻子发请求过来啦！路径（带查询参数）为：' + pathWithQuery)

    // 自动导向index.html
    const file_path = path === '/' ? '/index.html' : path;
    const separator = file_path.lastIndexOf('.');
    const suffix = file_path.substring(separator+1);

    // hash 设置suffix对应response header
    const file_types = {
        'html':'text/html',
        'css':'text/css',
        'js':'text/javascript',
        'png':'image/png',
        'jpg':'image/jpeg'
    }
    response.setHeader('Content-Type',`${file_types[suffix] || 'text/html'};charset=utf-8`);


    let content
    try{
        content = fs.readFileSync(`./public${file_path}`)
    }catch(error){
        content = '文件不存在'
        response.statusCode = 404
    }
    response.write(content)
    response.end()

})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)