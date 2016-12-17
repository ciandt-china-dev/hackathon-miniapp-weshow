using Emgu.CV;
using Emgu.CV.Structure;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
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
            Image<Bgr, byte> frame = new Image<Bgr, byte>(@"1.jpg");
            Rectangle[] results = haar.DetectMultiScale(frame, 1.3, 3, new System.Drawing.Size(10, 10));
            //检测并将数据储存
            List<Rectangle> Rectangles = new List<Rectangle>(2);
            foreach (Rectangle result in results)
            {

                //CvInvoke.Rectangle(frame, result, new Bgr(Color.Red).MCvScalar, 2);  //在检测到的区域绘制红框
                //  Image<Bgr, Byte> imageGlass = new Image<Bgr, byte>(@"C:\Users\37797\Desktop\glass.png");
                //CvInvoke.BitwiseNot(frame, imageGlass, result)
                Rectangles.Add(result);
            }
            Image<Gray, Byte> imageResult = new Image<Gray, Byte>(frame.Width, frame.Height);
            imageResult.ROI = new Rectangle(0, 0, frame.Width, frame.Height);
            frame.CopyTo(imageResult);
            imageResult.ROI = new Rectangle(0, image1.Height, image2.Width, image2.Height);
            //Image<Bgr, Byte> imageGlass= new Image<Bgr, byte>(@"C:\Users\37797\Desktop\glass.png");
            //CvInvoke.BitwiseNot(frame, imageGlass,)
            imageBox1.Image = frame;
        }
    }
}
