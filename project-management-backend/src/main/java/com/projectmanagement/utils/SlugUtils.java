package com.projectmanagement.utils;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {

    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");
    private static final Pattern LEADING_TRAILING_HYPHENS = Pattern.compile("^-|-$");

    private SlugUtils() {}

    public static String toSlug(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        String lower = normalized.toLowerCase(Locale.ENGLISH);
        String slug = NON_ALPHANUMERIC.matcher(lower).replaceAll("-");
        return LEADING_TRAILING_HYPHENS.matcher(slug).replaceAll("");
    }
}
