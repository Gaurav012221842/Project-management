package com.projectmanagement.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PaginationUtils {

    private PaginationUtils() {}

    public static Pageable createPageRequest(int page, int size) {
        return PageRequest.of(Math.max(page, 0), Math.min(size, 100));
    }

    public static Pageable createPageRequest(int page, int size, String sortBy, String direction) {
        Sort sort = "desc".equalsIgnoreCase(direction)
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        return PageRequest.of(Math.max(page, 0), Math.min(size, 100), sort);
    }
}
