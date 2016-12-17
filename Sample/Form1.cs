using Emgu.CV;
using Emgu.CV.Structure;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Sample
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            CascadeClassifier haar = new CascadeClassifier("haarcascade_eye.xml");    //初始化分类器
            Image<Bgr, Byte> imageGlass = new Image<Bgr, byte>(@"images\\glass.png");
            Image<Bgr, byte> frame = new Image<Bgr, byte>(@"images\\8.PNG");
            Rectangle[] resultRactangles = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            Bitmap imageResult = new Bitmap(frame.Width, frame.Height);
            using (Graphics g = Graphics.FromImage(imageResult))
            {
                RectangleF rect = new RectangleF(resultRactangles[0].X, resultRactangles[0].Y, resultRactangles[1].X - resultRactangles[0].X + resultRactangles[1].Width, resultRactangles[0].Height);
                g.DrawImage(frame.Bitmap, 0, 0);
                var glass = imageGlass.Bitmap;
                glass.MakeTransparent();
                g.DrawImage(glass, rect);
            }
            Image<Bgr, Byte> res = new Image<Bgr, byte>(imageResult);
            imageBox1.Image = res;
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

        public Bitmap CovertToBitmap(Rectangle sourceRect, Bitmap image)
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

        private void button2_Click(object sender, EventArgs e)
        {
            CascadeClassifier haar = new CascadeClassifier("haarcascade_frontalface_default.xml");    //初始化分类器
            Image<Bgr, byte> frame = new Image<Bgr, byte>(@"images\\" + textBox1.Text + ".PNG");
            Rectangle[] results = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            foreach (Rectangle result in results)
            {
                //CvInvoke.Rectangle(frame, result, new Bgr(Color.Red).MCvScalar, 2);
                var image = frame.Bitmap;
                CovertToBitmap(result, image);
                var brightness = GetImageBrightness(image);
                MessageBox.Show(GetImageBrightness(image).ToString());
                if (brightness < 0.63)
                    MessageBox.Show("you are a little black");
            }
            Bitmap imageResult = new Bitmap(frame.Width, frame.Height);
            Image<Bgr, Byte> res = new Image<Bgr, byte>(imageResult);
            //res.Save("test.jpg");
            imageBox1.Image = frame;
        }
    }
}
