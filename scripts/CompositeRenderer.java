import java.awt.*;
import java.awt.image.*;
import java.io.*;
import javax.imageio.*;

public class CompositeRenderer {
    public static void main(String[] args) throws Exception {
        if (args.length < 3) {
            System.err.println("Usage: java CompositeRenderer <refImg> <webImg> <outputImg>");
            System.exit(1);
        }
        File refFile = new File(args[0]);
        File webFile = new File(args[1]);
        File outFile = new File(args[2]);

        BufferedImage refImg = ImageIO.read(refFile);
        BufferedImage webImg = ImageIO.read(webFile);

        int pad = 20;
        int headerH = 50;
        int targetH = Math.max(refImg.getHeight(), webImg.getHeight());
        int totalW = refImg.getWidth() + webImg.getWidth() + pad * 3;
        int totalH = targetH + headerH + pad * 2;

        BufferedImage composite = new BufferedImage(totalW, totalH, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = composite.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        // Dark background
        g.setColor(new Color(15, 23, 42)); // Slate 900
        g.fillRect(0, 0, totalW, totalH);

        // Font
        Font font = new Font(Font.SANS_SERIF, Font.BOLD, 16);
        g.setFont(font);

        // Header 1: Reference
        g.setColor(new Color(56, 189, 248)); // Sky 400
        g.drawString("Official APK Logic & Fonts (Ground Truth)", pad, pad + 24);

        // Header 2: Web App
        int x2 = pad * 2 + refImg.getWidth();
        g.drawString("Web App Canvas Render (ai-xctrack-config)", x2, pad + 24);

        // Draw Images
        g.drawImage(refImg, pad, headerH + pad, null);
        g.drawImage(webImg, x2, headerH + pad, null);

        // Draw borders around each preview
        g.setColor(new Color(71, 85, 105));
        g.drawRect(pad - 1, headerH + pad - 1, refImg.getWidth() + 1, refImg.getHeight() + 1);
        g.drawRect(x2 - 1, headerH + pad - 1, webImg.getWidth() + 1, webImg.getHeight() + 1);

        g.dispose();
        ImageIO.write(composite, "png", outFile);
        System.out.println("Saved composite comparison to: " + outFile.getAbsolutePath());
    }
}
