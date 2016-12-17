using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;

namespace WeShow.Controllers
{
    public class ImageController : ApiController
    {
        // GET: Image
        [HttpPost]
        [Route("/api/image/automatic")]
        public HttpResponseMessage Index()
        {
            //文件保存目录路径 
            string SaveTempPath = "/imageTemp";
            String dirTempPath = HttpContext.Current.Server.MapPath(SaveTempPath);
            var provider = new MultipartFormDataStreamProvider(dirTempPath);
            var task = Request.Content.ReadAsMultipartAsync(provider).ContinueWith(m => {
                var file = provider.FileData[0];
                
                string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                FileInfo fileinfo = new FileInfo(file.LocalFileName);
                String ymd = DateTime.Now.ToString("yyyyMMdd", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                String newFileName = DateTime.Now.ToString("yyyyMMddHHmmss_ffff", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                string fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));
                fileinfo.CopyTo(Path.Combine(dirTempPath, newFileName + fileExt), true);
                fileinfo.Delete();
            });
           
            var imgPath = @"11";
            //从图片中读取byte
            var imgByte = File.ReadAllBytes(imgPath);
            //从图片中读取流
            var imgStream = new MemoryStream(File.ReadAllBytes(imgPath));
            var resp = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new ByteArrayContent(imgByte)
                //或者
                //Content = new StreamContent(stream)
            };
            resp.Content.Headers.ContentType = new MediaTypeHeaderValue("image/jpg");
            return resp;
        }
    }
}