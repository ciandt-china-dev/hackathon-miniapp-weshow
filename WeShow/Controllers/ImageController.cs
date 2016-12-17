using Emgu.CV;
using Emgu.CV.Structure;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using WeShow.Results;

namespace WeShow.Controllers
{
    public class ImageController : ApiController
    {
        private string imageRoot = "imageTemp";
        private string serverImageRoot;
        // GET: Image
        [HttpPost]
        [Route("image/automatic")]
        public HttpResponseMessage Index()
        {
            //文件保存目录路径 
            HttpPostedFile file = null;
            if (!GetUploadImage(out file))
            {
                return new JsonResult(new SampleResult() { Status = 2, Data = "上传文件出错" });
            }
            serverImageRoot = GetServerPath(Path.Combine(imageRoot, file.FileName));
            CascadeClassifier haar = new CascadeClassifier(GetServerPath("Lib/haarcascade_eye.xml"));    //初始化分类器

            Image<Bgr, byte> frame = new Image<Bgr, byte>(serverImageRoot);  //加载上传的图片

            List<Rectangle> Rectangles = GetEyesByImage(haar, frame);
            foreach (var Rectangle in Rectangles)
            {

            }

            Image<Bgr, Byte> imageGlass = ChooseGlass(serverImageRoot);
            if (Rectangles.Count < 2|| Rectangles.Count>3)
            {
                return new JsonResult(new SampleResult() { Status = 2, Data = "我现在还不够聪明，需要钱来改善我的基因" });
            }
            if(Rectangles.Count ==3)
            {
                ExecuteWhenRectangleCountEquals3(Rectangles);
            }
            SortRectangle(Rectangles);
            Bitmap imageResult = GetUpdatedImage(frame, Rectangles, imageGlass);
            imageResult.Save(serverImageRoot);

            return new JsonResult(new SampleResult() { Status = 1, Data = Path.Combine("image", Path.Combine(imageRoot, file.FileName)) });
        }

        private static void ExecuteWhenRectangleCountEquals3(List<Rectangle> Rectangles)
        {
            var eyewidth0 = Rectangles[0].Width;
            var eyewidth1 = Rectangles[1].Width;
            var eyewidth2 = Rectangles[2].Width;
            List<int> betweenArry = new List<int>();
            var between0and1 = Math.Abs(Rectangles[0].Width - Rectangles[1].Width);
            betweenArry.Add(between0and1);
            var between0and2 = Math.Abs(Rectangles[0].Width - Rectangles[2].Width);
            betweenArry.Add(between0and2);
            var between1and2 = Math.Abs(Rectangles[1].Width - Rectangles[2].Width);
            betweenArry.Add(between1and2);
            var minBetween = betweenArry.Min();
            if (between0and1 == minBetween)
            {
                Rectangles.RemoveAt(2);
            }
            else if (between0and2 == minBetween)
            {
                Rectangles.RemoveAt(1);
            }
            else
            {
                Rectangles.RemoveAt(0);
            }
        }

        private static Bitmap GetUpdatedImage(Image<Bgr, byte> frame, List<Rectangle> Rectangles, Image<Bgr, byte> imageGlass)
        {
            Bitmap imageResult = new Bitmap(frame.Width, frame.Height);
            using (Graphics g = Graphics.FromImage(imageResult))
            {
                RectangleF rect = new RectangleF(Rectangles[0].X- Rectangles[0].Width/2, Rectangles[0].Y, Rectangles[1].X - Rectangles[0].X + Rectangles[1].Width+ Rectangles[0].Width / 2+ Rectangles[1].Width / 2, Rectangles[0].Height);
                g.DrawImage(frame.Bitmap, 0, 0);
                var glass = imageGlass.Bitmap;
                glass.MakeTransparent();
                g.DrawImage(glass, rect);

            }

            return imageResult;
        }

        private static void SortRectangle(List<Rectangle> Rectangles)
        {
            if (Rectangles[0].X > Rectangles[1].X)
            {
                Rectangles.Reverse();
            }
        }

        private static List<Rectangle> GetEyesByImage(CascadeClassifier haar, Image<Bgr, byte> frame)
        {
            Rectangle[] results = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            List<Rectangle> Rectangles = new List<Rectangle>(2);
            foreach (Rectangle Rectangle in results)
            {

                //CvInvoke.Rectangle(frame, result, new Bgr(Color.Red).MCvScalar, 2);  //在检测到的区域绘制红框

                Rectangles.Add(Rectangle);
            }

            return Rectangles;
        }

        private bool GetUploadImage(out HttpPostedFile file)
        {
            var files = HttpContext.Current.Request.Files;
            if(files.Count!=1)
            {
                file = null;
                return false;
            }
            var f= files[0];
            // 文件安全验证...
            file = f;
            file.SaveAs(HttpContext.Current.Server.MapPath(Path.Combine(imageRoot, f.FileName)));
            return true;
        }

        private string GetServerPath(string path)
        {
            return HttpContext.Current.Server.MapPath(path);
        }
        public double GetImageBrightness(Bitmap bitmap)
        {
            var colors = new List<Color>();
            for (int x = 0; x < bitmap.Size.Width; x++)
            {
                for (int y = 0; y < bitmap.Size.Height; y++)
                {
                    var pixel = bitmap.GetPixel(x, y);
                    var brightness = pixel.GetBrightness();
                    if (brightness > 0.5 && brightness < 0.9)
                        colors.Add(pixel);
                }
            }

            return colors.Average(color => color.GetBrightness());
        }

        public Bitmap CovertRectangleToBitmap(Rectangle sourceRect, Bitmap image)
        {
            using (var bmp = new Bitmap((int)sourceRect.Width, (int)sourceRect.Height))
            {
                using (var graphics = Graphics.FromImage(bmp))
                {
                    graphics.DrawImage(image, 0.0f, 0.0f, sourceRect, GraphicsUnit.Pixel);
                }
                return bmp;
            }
        }
        private Image<Bgr, Byte> ChooseGlass(string imagePath)
        {
            CascadeClassifier haar = new CascadeClassifier(GetServerPath(@"Lib\haarcascade_frontalface_default.xml"));    //初始化分类器
            Image<Bgr, byte> frame = new Image<Bgr, byte>(imagePath);
            Rectangle[] results = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            if(results.Count()>1)
            {
                Rectangle result = results[0];
                     var image = frame.Bitmap;
                CovertRectangleToBitmap(result, image);
                var brightness = GetImageBrightness(image);

                if (brightness < 0.63)
                {
                    ///黑皮肤
                    return new Image<Bgr, byte>(GetServerPath(@"Lib\glass.png"));
                }
                else
                {
                    return new Image<Bgr, byte>(GetServerPath(@"Lib\glass.png"));
                }
            }
            else
            {
                return new Image<Bgr, byte>(GetServerPath(@"Lib\glass.png"));
            }
          
        
            
        }
    }
}