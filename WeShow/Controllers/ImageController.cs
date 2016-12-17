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
        private string strImageRootPath = "Uploads";
        private string strImageFullPath;
        private string strImageFileName;
        #region Api
        [HttpPost]
        [Route("{option}")]
        public HttpResponseMessage Index(string option)
        {
            try
            {
                HttpPostedFile file = null;
                if (string.IsNullOrEmpty(option) || !GetUploadImage(out file))
                {
                    // 这里直接返回猪头
                    return new JsonResult( "Lib/pig.jpg" );
                }

                var optionArray = option.Split(',');
                Bitmap imageResult = null;
                strImageFileName = DateTime.Now.ToString("yyyyMMddHHmmss") + file.FileName;
                strImageFullPath = GetServerPath(Path.Combine(strImageRootPath, strImageFileName));
                file.SaveAs(strImageFullPath);
                if (optionArray.Contains("glass"))
                {
                    #region 加眼镜
                    CascadeClassifier haar = new CascadeClassifier(GetServerPath("Lib/haarcascade_eye.xml"));    //初始化分类器
                    Image<Bgr, byte> frame = new Image<Bgr, byte>(strImageFullPath);  //加载上传的图片

                    List<Rectangle> Rectangles = GetRectanglesByImage(haar, frame);


                    Image<Bgr, Byte> imageGlass = ChooseGlass(strImageFullPath);
                    if (Rectangles.Count < 2 || Rectangles.Count > 5)
                    {
                        return new JsonResult("Lib/pig.jpg" );
                    }
                    if (Rectangles.Count == 3)
                    {
                        ExecuteWhenRectangleCountEquals3(Rectangles);
                    }
                    if(Rectangles.Count==4)
                    {
                        ExecuteWhenRectangleCountEquals4(Rectangles);
                    }
                    SortRectangle(Rectangles);
                    imageResult = GetUpdatedImageWithGlass(frame, Rectangles, imageGlass);
                    #endregion
                }
                if (optionArray.Contains("hat"))
                {
                    CascadeClassifier haar = new CascadeClassifier(GetServerPath(@"Lib\haarcascade_frontalface_default.xml"));    //初始化分类器
                    Image<Bgr, Byte> imageHat = ChooseHat(strImageFullPath);
                    Image<Bgr, byte> hatFrame;
                    if (imageResult == null)
                    {
                        hatFrame = new Image<Bgr, byte>(strImageFullPath);
                        imageResult = hatFrame.Bitmap;
                    }
                    else
                    {
                        hatFrame = new Image<Bgr, byte>(imageResult);
                    }

                    Rectangle[] resultRactangles = haar.DetectMultiScale(hatFrame, 1.1, 10, new System.Drawing.Size(10, 10));
                    //检测并将数据储存
                    if (resultRactangles.Count() != 1)
                    {
                        return new JsonResult("Lib/pig.jpg" );
                    }
                    Bitmap AddHatImageResult = new Bitmap(hatFrame.Width, hatFrame.Height);
                    using (Graphics g = Graphics.FromImage(imageResult))
                    {
                        RectangleF rect = new RectangleF(resultRactangles[0].X - (int)(resultRactangles[0].Width / 7.5), resultRactangles[0].Y - (int)(resultRactangles[0].Height / 1.5), (int)(resultRactangles[0].Width * 1.25), resultRactangles[0].Height);
                        g.DrawImage(hatFrame.Bitmap, 0, 0);
                        var hatImage = imageHat.Bitmap;
                        hatImage.MakeTransparent();
                        g.DrawImage(hatImage, rect);
                    }
                    //Image<Bgr, Byte> res = new Image<Bgr, byte>(imageResult);

                }



                return SaveFileThenReturnResult(imageResult);
            }
            catch(Exception e)
            {
                return  new JsonResult( e.ToString() );
            }
            

        }

        private void ExecuteWhenRectangleCountEquals4(List<Rectangle> rectangles)
        {
            while (rectangles.Count > 2)
            {
                var minHeight = rectangles.Min(m => m.Height);
                var current = rectangles.First(m => m.Height == minHeight);
                rectangles.Remove(current);
            }
        }

        private HttpResponseMessage SaveFileThenReturnResult(Bitmap imageResult)
        {
            imageResult.Save(strImageFullPath);

            return new JsonResult( Path.Combine(Path.Combine(strImageRootPath, strImageFileName)) );
        }

        #endregion
        #region AddGlassInternal

        private static void ExecuteWhenRectangleCountEquals3(List<Rectangle> rectangles)
        {
          
            var maxHeight = rectangles.Max(m => m.Height);
            var minHeight = rectangles.Min(m => m.Height);
            var midHeight = rectangles.First(m => m.Height != maxHeight && m.Height != minHeight).Height;
            if(maxHeight- midHeight >= midHeight- minHeight)
            {
                var current = rectangles.First(m => m.Height == maxHeight);
                rectangles.Remove(current);
            }
            else
            {
                var current = rectangles.First(m => m.Height==minHeight);
                rectangles.Remove(current);
            }
          

        }

        private static Bitmap GetUpdatedImageWithGlass(Image<Bgr, byte> frame, List<Rectangle> Rectangles, Image<Bgr, byte> imageGlass)
        {
            Bitmap imageResult = new Bitmap(frame.Width, frame.Height);
            using (Graphics g = Graphics.FromImage(imageResult))
            {
                RectangleF rect = new RectangleF(Rectangles[0].X - Rectangles[0].Width / 2, Rectangles[0].Y, Rectangles[1].X - Rectangles[0].X + Rectangles[1].Width + Rectangles[0].Width / 2 + Rectangles[1].Width / 2, Rectangles[0].Height);
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



        private bool GetUploadImage(out HttpPostedFile file)
        {
            var files = HttpContext.Current.Request.Files;
            if (files.Count > 0)
            {
                file = files[0];
                //file.SaveAs(HttpContext.Current.Server.MapPath(Path.Combine(imageRoot, DateTime.Now.ToString("yyyyMMddHHmmss") + file.FileName)));
                return true;
            }
            file = null;
            return false;
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
            if (results.Count() >= 1)
            {
                Rectangle result = results[0];
                var image = frame.Bitmap;
                CovertRectangleToBitmap(result, image);
                var brightness = GetImageBrightness(image);

                Random r = new Random();
                if (brightness < 0.63)
                {
                    ///黑皮肤
                    return new Image<Bgr, byte>(GetServerPath($"Lib\\glass_light{r.Next(1,3).ToString()}.png"));
                }
                else
                {
                    return new Image<Bgr, byte>(GetServerPath($"Lib\\glass_dark{r.Next(1,3).ToString()}.png"));
                }
            }
            else
            {
                return new Image<Bgr, byte>(GetServerPath(@"Lib\glass.png"));
            }



        }
        #endregion
        #region common
        private static List<Rectangle> GetRectanglesByImage(CascadeClassifier haar, Image<Bgr, byte> frame)
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

        #endregion
        private static Bitmap GetUpdatedImageWithBread(Image<Bgr, byte> frame, Rectangle Rectangle, Image<Bgr, byte> imageBread)
        {
            Bitmap imageResult = new Bitmap(frame.Width, frame.Height);
            using (Graphics g = Graphics.FromImage(imageResult))
            {
                RectangleF rect = new RectangleF(Rectangle.X, Rectangle.Y, Rectangle.Width, -Rectangle.Height);
                g.DrawImage(frame.Bitmap, 0, 0);
                var glass = imageBread.Bitmap;
                glass.MakeTransparent();
                g.DrawImage(glass, rect);

            }

            return imageResult;
        }
        private Image<Bgr, Byte> ChooseHat(string imagePath)
        {
            CascadeClassifier haar = new CascadeClassifier(GetServerPath(@"Lib\haarcascade_frontalface_default.xml"));    //初始化分类器
            Image<Bgr, byte> frame = new Image<Bgr, byte>(imagePath);
            Rectangle[] results = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            if (results.Count() >= 1)
            {
                Rectangle result = results[0];
                var image = frame.Bitmap;
                CovertRectangleToBitmap(result, image);
                var brightness = GetImageBrightness(image);

                if (brightness < 0.63)
                {
                    
                    ///黑皮肤
                    return new Image<Bgr, byte>(GetServerPath(@"Lib\hat_light.png"));
                }
                else
                {
                    Random r = new Random();
                    return new Image<Bgr, byte>(GetServerPath($"Lib\\hat_dark{r.Next(1,4).ToString()}.png"));
                }
            }
            else
            {
                return new Image<Bgr, byte>(GetServerPath(@"Lib\hat_light"));
            }



        }

    }
}