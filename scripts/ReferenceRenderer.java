import java.awt.*;
import java.awt.image.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
import javax.imageio.*;

public class ReferenceRenderer {
    public static void main(String[] args) throws Exception {
        int width = 412;
        int height = 915;
        if (args.length >= 2) {
            width = Integer.parseInt(args[0]);
            height = Integer.parseInt(args[1]);
        }
        String widgetsDataFile = args.length >= 3 ? args[2] : "scripts/reference_widgets.txt";
        String outputFile = args.length >= 4 ? args[3] : "scripts/reference_render.png";

        File fontFile = new File("src/assets/fonts/droidsans_bold_xctrack_custom.ttf");
        Font xctrackFont = Font.createFont(Font.TRUETYPE_FONT, fontFile);
        File robotoFile = new File("src/assets/fonts/roboto_condensed_bold.ttf");
        Font condensedFont = Font.createFont(Font.TRUETYPE_FONT, robotoFile);

        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = image.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

        // Dark background (XCTrack BlackTheme)
        g.setColor(new Color(16, 20, 26));
        g.fillRect(0, 0, width, height);

        // Read widgets data line by line:
        // format: x1|y1|x2|y2|showTitle|showUnit|border|bg|title|value|unit|isMap|isSideView|isStatus
        if (new File(widgetsDataFile).exists()) {
            java.util.List<String> lines = Files.readAllLines(Paths.get(widgetsDataFile));
            for (String line : lines) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue;
                String[] parts = line.split("\\|", -1);
                int x1 = Integer.parseInt(parts[0]);
                int y1 = Integer.parseInt(parts[1]);
                int x2 = Integer.parseInt(parts[2]);
                int y2 = Integer.parseInt(parts[3]);
                boolean showTitle = Boolean.parseBoolean(parts[4]);
                boolean showUnit = Boolean.parseBoolean(parts[5]);
                boolean border = Boolean.parseBoolean(parts[6]);
                int bg = Integer.parseInt(parts[7]); // 0..100 transparency %
                String title = parts[8];
                String value = parts[9];
                String unit = parts[10];
                boolean isMap = Boolean.parseBoolean(parts[11]);
                boolean isSideView = Boolean.parseBoolean(parts[12]);
                boolean isStatus = Boolean.parseBoolean(parts[13]);

                // Pixel coordinates
                int px = Math.round((x1 / 10000.0f) * width);
                int py = Math.round((y1 / 10000.0f) * height);
                int pw = Math.round(((x2 - x1) / 10000.0f) * width);
                int ph = Math.round(((y2 - y1) / 10000.0f) * height);

                // Background
                int alpha = Math.round(((100 - bg) * 255.0f) / 100.0f);
                if (alpha > 0) {
                    g.setColor(new Color(0, 0, 0, alpha));
                    g.fillRect(px, py, pw, ph);
                }

                // Border
                if (border) {
                    g.setColor(new Color(128, 128, 128, 180));
                    g.drawRect(px, py, pw - 1, ph - 1);
                }

                // Clip to widget box
                Shape origClip = g.getClip();
                g.clipRect(px, py, pw, ph);

                if (isMap) {
                    // Map styling
                    g.setColor(new Color(20, 35, 30));
                    g.fillRect(px, py, pw, ph);
                    g.setColor(new Color(38, 189, 248, 80));
                    g.drawString("XC ASSISTANT MAP", px + 8, py + 20);
                } else if (isSideView) {
                    // SideView styling
                    g.setColor(new Color(25, 30, 40));
                    g.fillRect(px, py, pw, ph);
                    g.setColor(new Color(56, 189, 248, 180));
                    g.setFont(condensedFont.deriveFont(Font.BOLD, 10f));
                    g.drawString("SIDE VIEW", px + 8, py + 16);
                } else if (isStatus) {
                    // Status bar styling
                    g.setColor(new Color(10, 14, 20));
                    g.fillRect(px, py, pw, ph);
                    g.setColor(new Color(148, 163, 184));
                    g.setFont(condensedFont.deriveFont(Font.BOLD, 10f));
                    g.drawString("GPS 3D  •  LIVE  •  85%  •  14:25", px + 8, py + ph - 4);
                } else {
                    // Title rendering
                    int titleH = 0;
                    if (showTitle && !title.isEmpty()) {
                        titleH = Math.max(12, Math.min(18, Math.round(ph * 0.22f)));
                        float titleFontSize = Math.max(9f, Math.min(13f, titleH * 0.72f));
                        g.setFont(condensedFont.deriveFont(Font.BOLD, titleFontSize));
                        g.setColor(new Color(128, 128, 128));
                        FontMetrics fmTitle = g.getFontMetrics();
                        int titleW = fmTitle.stringWidth(title.toUpperCase());
                        int tx = px + (pw - titleW) / 2;
                        int ty = py + (int)((titleH - fmTitle.getHeight()) / 2.0f) + fmTitle.getAscent();
                        g.drawString(title.toUpperCase(), tx, ty);
                    }

                    // Value and Unit rendering
                    int availW = Math.max(10, pw - 8);
                    int availH = Math.max(10, ph - titleH - 6);

                    boolean hasUnit = showUnit && unit != null && !unit.isEmpty();
                    float charRatio = 0.58f;
                    float unitFactor = hasUnit ? Math.min(0.40f, unit.length() * 0.28f + 0.15f) : 0f;
                    float valAvailW = availW * (1.0f - unitFactor);

                    float fontByW = valAvailW / Math.max(1.0f, value.length() * charRatio);
                    float fontByH = availH * 0.85f;
                    float valFontSize = Math.max(10f, Math.min(fontByH, fontByW));
                    float unitFontSize = Math.max(9f, valFontSize * 0.38f);

                    Font valFont = xctrackFont.deriveFont(Font.BOLD, valFontSize);
                    g.setFont(valFont);
                    FontMetrics fmVal = g.getFontMetrics();
                    int valW = fmVal.stringWidth(value);

                    int totalW = valW;
                    int unitW = 0;
                    FontMetrics fmUnit = null;
                    if (hasUnit) {
                        g.setFont(condensedFont.deriveFont(Font.BOLD, unitFontSize));
                        fmUnit = g.getFontMetrics();
                        unitW = fmUnit.stringWidth(unit) + 3;
                        totalW += unitW;
                    }

                    int startX = px + Math.max(4, (pw - totalW) / 2);
                    int baselineY = py + titleH + (availH + fmVal.getAscent() - fmVal.getDescent()) / 2;

                    // Draw main value
                    g.setFont(valFont);
                    g.setColor(new Color(248, 250, 252));
                    g.drawString(value, startX, baselineY);

                    // Draw unit
                    if (hasUnit && fmUnit != null) {
                        g.setFont(condensedFont.deriveFont(Font.BOLD, unitFontSize));
                        g.setColor(new Color(148, 163, 184));
                        g.drawString(unit, startX + valW + 3, baselineY);
                    }
                }

                g.setClip(origClip);
            }
        }

        g.dispose();
        ImageIO.write(image, "png", new File(outputFile));
        System.out.println("Reference rendered successfully to: " + outputFile);
    }
}
